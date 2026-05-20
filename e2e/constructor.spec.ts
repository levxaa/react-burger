import { ingredients } from '@/utils/ingredients';
import { test, expect, type Page, type Locator } from '@playwright/test';

const setupIngredientsMock = async (page: Page): Promise<void> => {
  await page.route('**/api/ingredients', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: ingredients,
      }),
    });
  });
};

const setupAuthMock = async (page: Page): Promise<void> => {
  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: { email: 'test@test.com', name: 'Test User' },
      }),
    });
  });
};

const setupAuth = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    localStorage.setItem('accessToken', 'Bearer mock-access-token');
    localStorage.setItem('refreshToken', 'mock-refresh-token');
  });
};

const ingredientCardLocator = (page: Page): Locator =>
  page.getByTestId('ingredient-card');
const bunCardLocator = (page: Page): Locator =>
  page.locator('[data-testid="ingredient-card"][data-ingredient-type="bun"]');
const mainCardLocator = (page: Page): Locator =>
  page.locator('[data-testid="ingredient-card"][data-ingredient-type="main"]');
const dropZoneLocator = (page: Page): Locator =>
  page.getByTestId('burger-constructor-drop-zone');
const orderButtonLocator = (page: Page): Locator => page.getByTestId('order-button');
const modalDialogLocator = (page: Page): Locator => page.getByTestId('modal-dialog');
const bunPlaceholderLocator = (page: Page): Locator =>
  page.getByTestId('constructor-bun-top-placeholder');
const orderNumberLocator = (page: Page): Locator => page.getByTestId('order-number');

test.describe('Страница конструктора', () => {
  test.beforeEach(async ({ page }) => {
    await setupIngredientsMock(page);
    await setupAuthMock(page);
    await page.goto('/');
    await page.waitForSelector('[data-testid="ingredient-card"]');
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
    });
  });

  test.describe('Кнопка заказа', () => {
    test('кнопка "Оформить заказ" disabled без булки', async ({ page }) => {
      await expect(orderButtonLocator(page)).toBeDisabled();
    });
  });

  test.describe('Модалка ингредиента', () => {
    test('клик на ингредиент открывает модалку', async ({ page }) => {
      await ingredientCardLocator(page).first().click();
      await expect(modalDialogLocator(page)).toBeVisible();
    });

    test('Escape закрывает модалку', async ({ page }) => {
      await ingredientCardLocator(page).first().click();
      await expect(modalDialogLocator(page)).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(modalDialogLocator(page)).not.toBeVisible();
    });
  });

  test.describe('Drag and Drop', () => {
    test('перетаскивание булки в конструктор', async ({ page }) => {
      await expect(bunPlaceholderLocator(page)).toBeVisible();

      await bunCardLocator(page).first().dragTo(dropZoneLocator(page));

      await expect(bunPlaceholderLocator(page)).not.toBeVisible();
    });

    test('перетаскивание начинки в конструктор', async ({ page }) => {
      await bunCardLocator(page).first().dragTo(dropZoneLocator(page));
      await mainCardLocator(page).first().dragTo(dropZoneLocator(page));

      await expect(page.getByTestId('constructor-ingredient')).toHaveCount(1);
    });

    test('кнопка заказа активируется после добавления булки', async ({ page }) => {
      await expect(orderButtonLocator(page)).toBeDisabled();

      await bunCardLocator(page).first().dragTo(dropZoneLocator(page));

      await expect(orderButtonLocator(page)).toBeEnabled();
    });
  });

  test.describe('Оформление заказа', () => {
    test('оформление заказа показывает модалку с номером 12345', async ({ page }) => {
      await setupAuth(page);

      await page.route('**/api/orders', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            order: { number: 12345 },
            name: 'Тестовый бургер',
          }),
        });
      });

      await page.reload();
      await page.waitForSelector('[data-testid="ingredient-card"]');

      await bunCardLocator(page).first().dragTo(dropZoneLocator(page));
      await page.waitForTimeout(300);

      await orderButtonLocator(page).click();
      await page.waitForSelector('[data-testid="modal-dialog"]', { timeout: 10000 });

      await expect(modalDialogLocator(page)).toBeVisible();
      await expect(orderNumberLocator(page)).toHaveText('12345');
    });

    test('модалка заказа содержит номер 12345', async ({ page }) => {
      await setupAuth(page);

      await page.route('**/api/orders', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            order: { number: 12345 },
            name: 'Тестовый бургер',
          }),
        });
      });

      await page.reload();
      await page.waitForSelector('[data-testid="ingredient-card"]');

      await bunCardLocator(page).first().dragTo(dropZoneLocator(page));
      await page.waitForTimeout(300);

      await orderButtonLocator(page).click();
      await page.waitForSelector('[data-testid="modal-dialog"]', { timeout: 10000 });

      await expect(modalDialogLocator(page)).toBeVisible();
      await expect(page.getByText('идентификатор заказа')).toBeVisible();
      await expect(orderNumberLocator(page)).toHaveText('12345');
    });
  });
});
