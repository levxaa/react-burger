import { test, expect } from '@playwright/test';

import type { Page } from '@playwright/test';

const setupAuthMock = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    localStorage.setItem('accessToken', 'Bearer mock-access-token');
    localStorage.setItem('refreshToken', 'mock-refresh-token');
  });

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

test.describe('Страница конструктора', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="ingredient-card"]');
  });

  test.describe('Загрузка страницы', () => {
    test('отображает заголовок "Соберите бургер"', async ({ page }) => {
      await expect(page.getByText('Соберите бургер')).toBeVisible();
    });

    test('отображает список ингредиентов', async ({ page }) => {
      await expect(page.getByTestId('ingredient-card').first()).toBeVisible();
      const count = await page.getByTestId('ingredient-card').count();
      expect(count).toBeGreaterThan(0);
    });

    test('конструктор пустой с плейсхолдерами', async ({ page }) => {
      await expect(page.getByTestId('burger-constructor-drop-zone')).toBeVisible();
      await expect(page.getByTestId('constructor-bun-top-placeholder')).toBeVisible();
    });
  });

  test.describe('Кнопка заказа', () => {
    test('кнопка "Оформить заказ" disabled без булки', async ({ page }) => {
      await expect(page.getByTestId('order-button')).toBeDisabled();
    });
  });

  test.describe('Модалка ингредиента', () => {
    test('клик на ингредиент открывает модалку', async ({ page }) => {
      await page.getByTestId('ingredient-card').first().click();
      await expect(page.getByTestId('modal-dialog')).toBeVisible();
    });

    test('Escape закрывает модалку', async ({ page }) => {
      await page.getByTestId('ingredient-card').first().click();
      await expect(page.getByTestId('modal-dialog')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByTestId('modal-dialog')).not.toBeVisible();
    });
  });

  test.describe('Drag and Drop', () => {
    test('перетаскивание булки в конструктор', async ({ page }) => {
      const bun = page
        .locator('[data-testid="ingredient-card"][data-ingredient-type="bun"]')
        .first();
      const dropZone = page.getByTestId('burger-constructor-drop-zone');

      await expect(page.getByTestId('constructor-bun-top-placeholder')).toBeVisible();

      await bun.dragTo(dropZone);

      await expect(
        page.getByTestId('constructor-bun-top-placeholder')
      ).not.toBeVisible();
    });

    test('перетаскивание начинки в конструктор', async ({ page }) => {
      const bun = page
        .locator('[data-testid="ingredient-card"][data-ingredient-type="bun"]')
        .first();
      const dropZone = page.getByTestId('burger-constructor-drop-zone');
      await bun.dragTo(dropZone);

      const mainIngredient = page
        .locator('[data-testid="ingredient-card"][data-ingredient-type="main"]')
        .first();
      await mainIngredient.dragTo(dropZone);

      await expect(page.getByTestId('constructor-ingredient')).toHaveCount(1);
    });

    test('кнопка заказа активируется после добавления булки', async ({ page }) => {
      const orderButton = page.getByTestId('order-button');
      await expect(orderButton).toBeDisabled();

      const bun = page
        .locator('[data-testid="ingredient-card"][data-ingredient-type="bun"]')
        .first();
      const dropZone = page.getByTestId('burger-constructor-drop-zone');
      await bun.dragTo(dropZone);

      await expect(orderButton).toBeEnabled();
    });
  });

  test.describe('Оформление заказа', () => {
    test('оформление заказа показывает модалку с номером', async ({ page }) => {
      await setupAuthMock(page);

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

      const bun = page
        .locator('[data-testid="ingredient-card"][data-ingredient-type="bun"]')
        .first();
      const dropZone = page.getByTestId('burger-constructor-drop-zone');
      await bun.dragTo(dropZone);

      await page.waitForTimeout(300);

      const orderButton = page.getByTestId('order-button');
      await expect(orderButton).toBeEnabled();

      await orderButton.click();

      await page.waitForSelector('[data-testid="modal-dialog"]', { timeout: 10000 });
      await expect(page.getByTestId('modal-dialog')).toBeVisible();
      await expect(page.locator('[class*="text_type_digits-large"]')).toContainText(
        /\d+/
      );
    });

    test('модалка заказа содержит текст об идентификаторе', async ({ page }) => {
      await setupAuthMock(page);

      await page.route('**/api/orders', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            order: { number: 67890 },
            name: 'Тестовый бургер',
          }),
        });
      });

      await page.reload();
      await page.waitForSelector('[data-testid="ingredient-card"]');

      const bun = page
        .locator('[data-testid="ingredient-card"][data-ingredient-type="bun"]')
        .first();
      const dropZone = page.getByTestId('burger-constructor-drop-zone');
      await bun.dragTo(dropZone);

      await page.waitForTimeout(300);

      const orderButton = page.getByTestId('order-button');
      await expect(orderButton).toBeEnabled();

      await orderButton.click();

      await page.waitForSelector('[data-testid="modal-dialog"]', { timeout: 10000 });
      await expect(page.getByTestId('modal-dialog')).toBeVisible();
      await expect(page.getByText('идентификатор заказа')).toBeVisible();
    });
  });
});
