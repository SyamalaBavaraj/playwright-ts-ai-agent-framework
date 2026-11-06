import { test, expect } from '../../src/fixtures/base';
import users from '../data/users.json';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { LoginPage } from '../../src/pages/LoginPage';

test.describe('Login flow', () => {
  test('standard_user logs in successfully @smoke @critical', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('1. Open the SauceDemo login page', async () => {
      // 1. Open https://www.saucedemo.com/ in a fresh browser state.
      await loginPage.goto();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    await test.step('2. Enter standard_user credentials', async () => {
      // 2. Enter standard_user in Username and secret_sauce in Password.
      await loginPage.enterCredentials(users.standard.username, users.standard.password);
      await expect(loginPage.usernameInput).toHaveValue(users.standard.username);
      await expect(loginPage.passwordInput).toHaveValue(users.standard.password);
    });

    await test.step('3. Submit credentials and verify the inventory page', async () => {
      // 3. Click Login.
      await loginPage.submit();
      const inventoryPage = new InventoryPage(page);

      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventoryPage.productsHeading).toBeVisible();
      await expect(inventoryPage.productCards).toHaveCount(12);
      await expect(loginPage.loginError).toHaveCount(0);
    });
  });
});