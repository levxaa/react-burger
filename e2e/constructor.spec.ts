import { test, expect, type Page, type Locator } from '@playwright/test';

const ingredientCardLocator = (page: Page): Locator =>
  page.getByTestId('ingredient-card');
const ingredientLocator = (page: Page, type: string): Locator =>
  page.locator(`[data-testid="ingredient-card"][data-ingredient-type="${type}"]`);
const bunCardLocator = (page: Page): Locator => ingredientLocator(page, 'bun');
const mainCardLocator = (page: Page): Locator => ingredientLocator(page, 'main');
const sauceCardLocator = (page: Page): Locator => ingredientLocator(page, 'sauce');
const dropZoneLocator = (page: Page): Locator =>
  page.getByTestId('burger-constructor-drop-zone');
const orderButtonLocator = (page: Page): Locator => page.getByTestId('order-button');
const modalDialogLocator = (page: Page): Locator => page.getByTestId('modal-dialog');
const modalOverlayLocator = (page: Page): Locator => page.getByTestId('modal-overlay');
const bunPlaceholderLocator = (page: Page): Locator =>
  page.getByTestId('constructor-bun-top-placeholder');
const orderNumberLocator = (page: Page): Locator => page.getByTestId('order-number');
const constructorIngredientLocator = (page: Page): Locator =>
  page.getByTestId('constructor-ingredient');

test.describe('Страница конструктора', () => {
  // test.use({ storageState: 'e2e/.auth/user.json' });

  test.beforeEach(async ({ page }) => {
    // Используем HAR файлы
    await page.routeFromHAR('./e2e/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
    });

    await page.routeFromHAR('./e2e/hars/auth-user.har', {
      url: '**/api/auth/user',
      update: false,
    });

    await page.routeFromHAR('./e2e/hars/orders.har', {
      url: '**/api/orders',
      update: false,
    });

    await page.goto('/');

    // Ждем загрузки ингредиентов
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000,
      state: 'attached',
    });

    await page.waitForTimeout(500);
  });

  test.describe('Загрузка страницы', () => {
    test('отображает заголовок "Соберите бургер"', async ({ page }) => {
      await expect(page.getByText('Соберите бургер')).toBeVisible();
    });

    test('отображает список ингредиентов', async ({ page }) => {
      await expect(ingredientCardLocator(page).first()).toBeVisible();
      const count = await ingredientCardLocator(page).count();
      expect(count).toBeGreaterThan(0);
    });

    test('конструктор пустой с плейсхолдерами', async ({ page }) => {
      await expect(dropZoneLocator(page)).toBeVisible();
      await expect(bunPlaceholderLocator(page)).toBeVisible();
      await expect(constructorIngredientLocator(page)).toHaveCount(0);
    });
  });

  test.describe('Кнопка заказа', () => {
    test('кнопка "Оформить заказ" disabled без булки', async ({ page }) => {
      await expect(orderButtonLocator(page)).toBeDisabled();

      const button = orderButtonLocator(page);
      await expect(button).toHaveAttribute('disabled', '');
    });
  });

  test.describe('Модалка ингредиента', () => {
    test('клик на ингредиент открывает модалку', async ({ page }) => {
      await ingredientCardLocator(page).first().click();
      await expect(modalDialogLocator(page)).toBeVisible();

      await expect(modalDialogLocator(page)).toContainText(
        /Калории|Белки|Жиры|Углеводы/
      );
    });

    test('Escape закрывает модалку', async ({ page }) => {
      await ingredientCardLocator(page).first().click();
      await expect(modalDialogLocator(page)).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(modalDialogLocator(page)).not.toBeVisible();
    });

    test('Клик за пределами модального окна закрывает его', async ({ page }) => {
      await ingredientCardLocator(page).first().click();
      await expect(modalDialogLocator(page)).toBeVisible();

      await modalOverlayLocator(page).click({ position: { x: 10, y: 10 } });
      await expect(modalDialogLocator(page)).not.toBeVisible();
    });
  });

  test.describe('Drag and Drop', () => {
    test('перетаскивание булки в конструктор', async ({ page }) => {
      await expect(bunPlaceholderLocator(page)).toBeVisible();

      await bunCardLocator(page).first().dragTo(dropZoneLocator(page));

      await page.waitForTimeout(500);

      await expect(bunPlaceholderLocator(page)).not.toBeVisible();

      await expect(page.locator('.constructor-element_pos_top')).toBeVisible();
      await expect(page.locator('.constructor-element_pos_bottom')).toBeVisible();
    });

    test('перетаскивание начинки в конструктор', async ({ page }) => {
      await bunCardLocator(page).first().dragTo(dropZoneLocator(page));
      await page.waitForTimeout(300);

      await mainCardLocator(page).first().dragTo(dropZoneLocator(page));
      await page.waitForTimeout(300);

      await expect(constructorIngredientLocator(page)).toHaveCount(1);
    });

    test('перетаскивание нескольких ингредиентов', async ({ page }) => {
      await bunCardLocator(page).first().dragTo(dropZoneLocator(page));
      await page.waitForTimeout(300);

      await mainCardLocator(page).first().dragTo(dropZoneLocator(page));
      await page.waitForTimeout(200);
      await sauceCardLocator(page).first().dragTo(dropZoneLocator(page));
      await page.waitForTimeout(200);

      await expect(constructorIngredientLocator(page)).toHaveCount(2);
    });

    test('кнопка заказа активируется после добавления булки', async ({ page }) => {
      await expect(orderButtonLocator(page)).toBeDisabled();

      await bunCardLocator(page).first().dragTo(dropZoneLocator(page));
      await page.waitForTimeout(500);

      await expect(orderButtonLocator(page)).toBeEnabled();
    });
  });

  test.describe('Оформление заказа', () => {
    test('оформление заказа показывает модалку с номером 1051', async ({ page }) => {
      await bunCardLocator(page).first().dragTo(dropZoneLocator(page));
      await page.waitForTimeout(500);

      await mainCardLocator(page).first().dragTo(dropZoneLocator(page));

      await page.waitForTimeout(300);
      await expect(orderButtonLocator(page)).toBeEnabled();

      await orderButtonLocator(page).click();
      //  await page.waitForResponse('**/api/orders', { timeout: 10000 });
      await expect(modalDialogLocator(page)).toBeVisible({ timeout: 10000 });
      await expect(orderNumberLocator(page)).toBeVisible();

      await expect(orderNumberLocator(page)).toHaveText('1051');
    });
  });
});
