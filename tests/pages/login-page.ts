import { Page, expect } from '@playwright/test';
import { BasePage } from '../base/base-page';
import { FormElement } from '../base/form-element';
import { IFormInteraction, IValidatable, LoginData, ValidationResult } from '../interfaces/page-interfaces';
import { TestConfigService } from '../services/test-config-service';
import { ValidationService } from '../services/validation-service';

export class LoginPage extends BasePage implements IFormInteraction, IValidatable {
  private readonly validationService: ValidationService;

  constructor(page: Page, configService?: TestConfigService) {
    super(page, configService);
    this.validationService = new ValidationService(page);
  }

  // Page Object Element Getters - Single Responsibility Principle
  private get emailField(): FormElement {
    return new FormElement(this.page.locator('input[placeholder="Email"]'));
  }

  private get passwordField(): FormElement {
    return new FormElement(this.page.locator('input[type="password"]'));
  }

  private get signInButton(): FormElement {
    return new FormElement(this.page.locator('button[type="submit"]:has-text("Sign in")'));
  }

  private get signUpLink(): FormElement {
    return new FormElement(this.page.locator('a:has-text("Need an account?")'));
  }

  private get pageHeading(): FormElement {
    return new FormElement(this.page.locator('h1:has-text("Sign in")'));
  }

  private get errorMessages(): FormElement {
    return new FormElement(this.page.locator('[class*="error"], [class*="alert"], .text-danger'));
  }

  // Implementation of IPageObject interface
  async navigateToPage(): Promise<void> {
    try {
      await this.page.goto(this.configService.getLoginUrl());
      await this.waitForCriticalElements();
    } catch (error) {
      await this.handleError('navigate to login page', error as Error);
    }
  }

  async isPageLoaded(): Promise<boolean> {
    try {
      await expect(this.pageHeading.getLocator()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  getPageIdentifier(): string {
    return 'Login Page';
  }

  protected async waitForCriticalElements(): Promise<void> {
    await expect(this.emailField.getLocator()).toBeVisible();
    await expect(this.passwordField.getLocator()).toBeVisible();
    await expect(this.signInButton.getLocator()).toBeVisible();
  }

  async fillForm(data: Record<string, string>): Promise<void> {
    const loginData = data as unknown as LoginData;

    await TestStep.execute('Fill email field', async () => {
      await this.emailField.fill(loginData.email);
    });

    await TestStep.execute('Fill password field', async () => {
      await this.passwordField.fill(loginData.password);
    });
  }

  async submitForm(): Promise<void> {
    await TestStep.execute('Click sign in button', async () => {
      await this.signInButton.click();
    });
  }

  async isFormValid(): Promise<boolean> {
    try {
      // Check if both fields have values
      const emailValue = await this.emailField.getValue();
      const passwordValue = await this.passwordField.getValue();

      // Check if submit button is enabled (client-side validation)
      const isButtonEnabled = await this.signInButton.getLocator().isEnabled();

      return emailValue.length > 0 && passwordValue.length > 0 && isButtonEnabled;
    } catch {
      return false;
    }
  }

  // Login-specific methods
  async fillLoginForm(loginData: LoginData): Promise<void> {
    await this.fillForm(loginData as unknown as Record<string, string>);
  }

  async performLogin(loginData: LoginData): Promise<void> {
    await this.fillLoginForm(loginData);
    await this.submitForm();
  }

  async isSubmitButtonEnabled(): Promise<boolean> {
    try {
      return await this.signInButton.getLocator().isEnabled();
    } catch {
      return false;
    }
  }

  async verifyLoginSuccess(expectedUsername?: string): Promise<void> {
    await TestStep.execute('Verify successful login', async () => {
      // Wait for navigation to home page or user menu to appear
      await this.page.waitForURL('**/');
      await expect(this.page).toHaveURL(/.*\/$/);

      if (expectedUsername) {
        // Check if user menu or profile link contains the username
        const userMenu = this.page.locator(`[href*="${expectedUsername}"], [href*="profile"]`);
        await expect(userMenu).toBeVisible({ timeout: 10000 });
      }
    });
  }

  async verifyLoginFailure(): Promise<void> {
    await TestStep.execute('Verify login failure', async () => {
      // Should stay on login page or show error messages
      await expect(this.page).toHaveURL(/.*login/);

      // Check for error messages
      const errors = await this.checkForErrorMessages();
      expect(errors.length).toBeGreaterThan(0);
    });
  }

  async checkForErrorMessages(): Promise<string[]> {
    try {
      const errorElements = this.page.locator('[class*="error"], [class*="alert"], .text-danger');
      const count = await errorElements.count();

      const errors: string[] = [];
      for (let i = 0; i < count; i++) {
        const text = await errorElements.nth(i).textContent();
        if (text && text.trim()) {
          errors.push(text.trim());
        }
      }

      return errors;
    } catch {
      return [];
    }
  }

  async navigateToRegistration(): Promise<void> {
    await TestStep.execute('Navigate to registration page', async () => {
      await this.signUpLink.click();
      await expect(this.page).toHaveURL(/.*register/);
    });
  }

  // Implementation of IValidatable interface
  async validatePageStructure(): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check critical elements exist
      if (!(await this.emailField.getLocator().isVisible())) {
        errors.push('Email field is not visible');
      }

      if (!(await this.passwordField.getLocator().isVisible())) {
        errors.push('Password field is not visible');
      }

      if (!(await this.signInButton.getLocator().isVisible())) {
        errors.push('Sign in button is not visible');
      }

      if (!(await this.pageHeading.getLocator().isVisible())) {
        errors.push('Page heading is not visible');
      }

      // Check form structure
      const form = this.page.locator('form');
      if ((await form.count()) === 0) {
        warnings.push('No form element found');
      }

      // Check accessibility
      const inputs = this.page.locator('input');
      const inputCount = await inputs.count();
      if (inputCount !== 2) {
        warnings.push(`Expected 2 input fields, found ${inputCount}`);
      }

    } catch (error) {
      errors.push(`Page structure validation failed: ${(error as Error).message}`);
    }

    return this.createValidationResult(errors.length === 0, errors, warnings);
  }

  async validateAccessibility(): Promise<ValidationResult> {
    return await this.validationService.validateAccessibility();
  }

  // Helper method for test data generation
  generateValidLoginCredentials(): LoginData {
    return {
      email: 'testuser@example.com',
      password: 'password123'
    };
  }

  generateInvalidEmailCredentials(): LoginData {
    return {
      email: 'invalid-email',
      password: 'password123'
    };
  }

  generateInvalidPasswordCredentials(): LoginData {
    return {
      email: 'testuser@example.com',
      password: ''
    };
  }

  generateNonExistentUserCredentials(): LoginData {
    return {
      email: 'nonexistent@example.com',
      password: 'wrongpassword'
    };
  }
}

// Import TestStep for internal use
import { TestStep } from '../interfaces/test-interfaces';