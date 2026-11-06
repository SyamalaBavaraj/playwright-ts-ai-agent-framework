
import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginError: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput = page.getByRole('textbox', {
      name: 'Username'
    });

    this.passwordInput = page.getByRole('textbox', {
      name: 'Password'
    });

    this.loginButton = page.getByRole('button', {
      name: 'Login'
    });

    this.loginError = page.getByRole('alert');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async enterCredentials(
    username: string,
    password: string
  ): Promise<void> {

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.loginButton.click();
  }
}
