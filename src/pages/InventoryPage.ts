
import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartPage } from './CartPage';

export class InventoryPage extends BasePage {

  readonly productsHeading: Locator;
  readonly productCards: Locator;
  readonly cartButton: Locator;

  constructor(page: Page) {
    super(page);

    this.productsHeading = page.getByText('Products', {
      exact: true
    });

    this.productCards = page.getByRole('button', {
      name: /^View details for /
    });

    this.cartButton = page.getByRole('button', {
      name: /^Cart, /
    });
  }

  async goto(): Promise<void> {
    await this.page.goto(
      'https://www.saucedemo.com/inventory.html'
    );
  }

  async addProductToCart(productName: string): Promise<void> {
    const productCard = this.page.getByRole('button', {
      name: `View details for ${productName}`,
    }).locator('..').locator('..');

    await productCard.getByRole('button', { name: 'Add to cart' }).click();
  }

  async openCart(): Promise<CartPage> {
    await this.cartButton.click();
    return new CartPage(this.page);
  }
}
