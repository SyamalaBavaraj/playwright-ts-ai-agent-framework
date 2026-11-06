import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CheckoutOverviewPage } from './CheckoutOverviewPage';

export class CheckoutInformationPage extends BasePage {
  readonly heading: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByText('Checkout: Your Information', { exact: true });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.postalCodeInput = page.getByRole('textbox', { name: 'Zip/Postal Code' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/checkout-step-one.html');
  }

  async enterInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview(): Promise<CheckoutOverviewPage> {
    await this.continueButton.click();
    return new CheckoutOverviewPage(this.page);
  }
}
