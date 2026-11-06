import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly successHeading: Locator;
  readonly confirmationMessage: Locator;
  readonly generatePdfButton: Locator;

  constructor(page: Page) {
    super(page);

    this.successHeading = page.getByRole('heading', {
      name: 'Thank you for your order!',
    });
    this.confirmationMessage = page.getByText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
      { exact: true },
    );
    this.generatePdfButton = page.getByRole('button', {
      name: 'Generate PDF order',
    });
  }

  async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/checkout-complete.html');
  }

  async generatePdfOrder(): Promise<void> {
    await this.generatePdfButton.click();
  }
}
