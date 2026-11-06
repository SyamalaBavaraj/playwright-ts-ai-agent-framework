import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CheckoutCompletePage } from './CheckoutCompletePage';

export class CheckoutOverviewPage extends BasePage {
  readonly heading: Locator;
  readonly productNames: Locator;
  readonly quantities: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByText('Checkout: Overview', { exact: true });
    this.productNames = page.getByRole('button', {
      name: /^View details for /,
    });
    this.quantities = page.getByText('1', { exact: true });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/checkout-step-two.html');
  }

  getProductPrice(price: string): Locator {
    return this.page.getByText(price, { exact: true });
  }

  getOrderSummaryLine(label: string, amount: string): Locator {
    return this.page.getByText(`${label}: ${amount}`, { exact: true });
  }

  async finishOrder(): Promise<CheckoutCompletePage> {
    await this.finishButton.click();
    return new CheckoutCompletePage(this.page);
  }
}
