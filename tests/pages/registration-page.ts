import { Page, expect } from '@playwright/test';
import { BasePage } from '../base/base-page';
import { FormElement } from '../base/form-element';
import { IFormInteraction, IValidatable, RegistrationData, ValidationResult } from '../interfaces/page-interfaces';
import { TestConfigService } from '../services/test-config-service';
import { ValidationService } from '../services/validation-service';

export class RegistrationPage extends BasePage implements IFormInteraction, IValidatable {
  private readonly validationService: ValidationService;

  constructor(page: Page, configService?: TestConfigService) {
    super(page, configService);
    this.validationService = new ValidationService(page);
  }

  // Page Object Element Getters - Single Responsibility Principle
  private get usernameField(): FormElement {
    return new FormElement(this.page.getByRole('textbox', { name: 'Username' }));
  }

  private get emailField(): FormElement {
    return new FormElement(this.page.getByRole('textbox', { name: 'Email' }));
  }

  private get passwordField(): FormElement {
    return new FormElement(this.page.getByRole('textbox', { name: 'Password' }));
  }

  private get submitButton(): FormElement {
    return new FormElement(this.page.getByRole('button', { name: 'Sign up' }));
  }

  private get loginLink(): FormElement {
    return new FormElement(this.page.getByRole('link', { name: 'Have an account?' }));
  }

  private get pageHeading(): FormElement {
    return new FormElement(this.page.getByRole('heading', { name: 'Sign up', level: 1 }));
  }

  // Implementation of IPageObject interface
  async navigateToPage(): Promise<void> {
    try {
      await this.page.goto(this.configService.getRegistrationUrl());
      await this.waitForCriticalElements();
    } catch (error) {
      await this.handleError('navigate to registration page', error as Error);
    }
  }

  async isPageLoaded(): Promise<boolean> {
    try {
      return await this.pageHeading.isVisible() && 
             await this.usernameField.isVisible() && 
             await this.submitButton.isVisible();
    } catch {
      return false;
    }
  }

  getPageIdentifier(): string {
    return 'Registration Page';
  }

  protected async waitForCriticalElements(): Promise<void> {
    await this.pageHeading.expectToBeVisible();
    await this.usernameField.expectToBeVisible();
    await this.emailField.expectToBeVisible();
    await this.passwordField.expectToBeVisible();
    await this.submitButton.expectToBeVisible();
  }

  // Implementation of IFormInteraction interface
  async fillForm(data: Record<string, string>): Promise<void> {
    try {
      if (data.username) await this.usernameField.fill(data.username);
      if (data.email) await this.emailField.fill(data.email);
      if (data.password) await this.passwordField.fill(data.password);
    } catch (error) {
      await this.handleError('fill form', error as Error);
    }
  }

  async fillRegistrationForm(data: RegistrationData): Promise<void> {
    await this.fillForm({
      username: data.username,
      email: data.email,
      password: data.password
    });
  }

  async submitForm(): Promise<void> {
    try {
      await this.submitButton.click();
    } catch (error) {
      await this.handleError('submit form', error as Error);
    }
  }

  async isFormValid(): Promise<boolean> {
    return await this.submitButton.isEnabled();
  }

  // Implementation of IValidatable interface
  async validatePageStructure(): Promise<ValidationResult> {
    const formValidation = await this.validationService.validateFormStructure([
      'Username', 'Email', 'Password'
    ]);
    
    const navigationValidation = await this.validationService.validateNavigationStructure([
      'Home', 'Sign in', 'Sign up'
    ]);

    return this.createValidationResult(
      formValidation.isValid && navigationValidation.isValid,
      [...formValidation.errors, ...navigationValidation.errors],
      [...formValidation.warnings, ...navigationValidation.warnings]
    );
  }

  async validateAccessibility(): Promise<ValidationResult> {
    return await this.validationService.validateAccessibility();
  }

  // Business Logic Methods - Clean and intention-revealing
  async verifyFormValidationBehavior(): Promise<void> {
    // Empty form should disable submit
    await this.submitButton.expectToBeDisabled();

    // Partial completion should keep button disabled
    await this.usernameField.fill('testuser');
    await this.submitButton.expectToBeDisabled();

    await this.emailField.fill('test@example.com');
    await this.submitButton.expectToBeDisabled();

    // Complete form should enable button
    await this.passwordField.fill('password123');
    await this.submitButton.expectToBeEnabled();
  }

  async navigateToLogin(): Promise<void> {
    try {
      await this.loginLink.click();
      await expect(this.page).toHaveURL(`${this.configService.getBaseUrl()}#/login`);
    } catch (error) {
      await this.handleError('navigate to login', error as Error);
    }
  }

  async verifyRegistrationSuccess(username: string): Promise<void> {
    // Verify redirect to home page
    await expect(this.page).toHaveURL(`${this.configService.getBaseUrl()}#/`);
    
    // Verify user-specific navigation elements appear
    await expect(this.page.getByRole('link', { name: 'New Article' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Settings' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: username })).toBeVisible();
  }

  async checkForErrorMessages(): Promise<string[]> {
    try {
      const errorList = this.page.locator('ul');
      if (await errorList.isVisible()) {
        const errorItems = await errorList.locator('li').all();
        const errors: string[] = [];
        for (const item of errorItems) {
          errors.push(await item.textContent() || '');
        }
        return errors;
      }
      return [];
    } catch {
      return [];
    }
  }
}