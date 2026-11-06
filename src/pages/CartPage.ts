import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CheckoutInformationPage } from './CheckoutInformationPage';

export class CartPage extends BasePage {
  readonly cartHeading: Locator;
  readonly productNames: Locator;
  readonly quantities: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);

    this.cartHeading = page.getByText('Your Cart', { exact: true });
    this.productNames = page.getByRole('button', {
      name: /^View details for /,
    });
    this.quantities = page.getByText('1', { exact: true });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/cart.html');
  }

  getProductPrice(price: string): Locator {
    return this.page.getByText(price, { exact: true });
  }

  async checkout(): Promise<CheckoutInformationPage> {
    await this.checkoutButton.click();
    return new CheckoutInformationPage(this.page);
  }
}
