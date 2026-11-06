import { stat } from 'node:fs/promises';
import { test, expect } from '../../src/fixtures/base';
import checkoutData from '../data/checkout.json';
import users from '../data/users.json';
import { CheckoutCompletePage } from '../../src/pages/CheckoutCompletePage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { LoginPage } from '../../src/pages/LoginPage';

test.describe('Product checkout @regression @critical', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.enterCredentials(users.standard.username, users.standard.password);
    await loginPage.submit();

    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('completes checkout and downloads the order PDF', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const [backpack, shirt] = checkoutData.products;

    await test.step('Add the selected products to the cart', async () => {
      await inventoryPage.addProductToCart(backpack.name);
      await inventoryPage.addProductToCart(shirt.name);
      await expect(inventoryPage.cartButton).toHaveAccessibleName('Cart, 2 items');
    });

    const cartPage = await inventoryPage.openCart();

    await test.step('Validate the shopping cart', async () => {
      await expect(cartPage.cartHeading).toBeVisible();
      await expect(cartPage.productNames).toHaveText(
        checkoutData.products.map((product) => product.name),
      );
      await expect(cartPage.quantities).toHaveCount(checkoutData.products.length);
      for (const product of checkoutData.products) {
        await expect(cartPage.getProductPrice(product.price)).toHaveCount(1);
      }
      await expect(cartPage.productNames).toHaveCount(checkoutData.products.length);
    });

    const informationPage = await cartPage.checkout();

    await test.step('Enter checkout information', async () => {
      await expect(informationPage.heading).toBeVisible();
      await informationPage.enterInformation(
        checkoutData.customer.firstName,
        checkoutData.customer.lastName,
        checkoutData.customer.postalCode,
      );
      await expect(informationPage.firstNameInput).toHaveValue(checkoutData.customer.firstName);
      await expect(informationPage.lastNameInput).toHaveValue(checkoutData.customer.lastName);
      await expect(informationPage.postalCodeInput).toHaveValue(checkoutData.customer.postalCode);
    });

    const overviewPage = await informationPage.continueToOverview();
    const itemTotal = checkoutData.products.reduce(
      (total, product) => total + Number(product.price.replace('$', '')),
      0,
    );
    const tax = Number((itemTotal * 0.08).toFixed(2));
    const total = (itemTotal + tax).toFixed(2);

    await test.step('Validate checkout overview totals', async () => {
      await expect(overviewPage.heading).toBeVisible();
      await expect(overviewPage.productNames).toHaveText(
        checkoutData.products.map((product) => product.name),
      );
      await expect(overviewPage.quantities).toHaveCount(checkoutData.products.length);
      for (const product of checkoutData.products) {
        await expect(overviewPage.getProductPrice(product.price)).toHaveCount(1);
      }
      await expect(overviewPage.getOrderSummaryLine('Item total', `$${itemTotal.toFixed(2)}`)).toBeVisible();
      await expect(overviewPage.getOrderSummaryLine('Tax', `$${tax.toFixed(2)}`)).toBeVisible();
      await expect(overviewPage.getOrderSummaryLine('Total', `$${total}`)).toBeVisible();
    });

    const completePage = await overviewPage.finishOrder();

    await test.step('Complete the order and download the PDF', async () => {
      await expect(completePage.successHeading).toBeVisible();
      await expect(completePage.confirmationMessage).toBeVisible();

      const downloadPromise = page.waitForEvent('download');
      await completePage.generatePdfOrder();
      const download = await downloadPromise;
      const downloadedPath = await download.path();

      expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
      expect(downloadedPath).not.toBeNull();

      const fileStats = await stat(downloadedPath as string);
      expect(fileStats.size).toBeGreaterThan(0);
    });
  });
});
