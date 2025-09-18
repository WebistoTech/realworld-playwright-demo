import { Page } from '@playwright/test';
import { IPageObject, INavigationCapable, ValidationResult } from '../interfaces/page-interfaces';
import { TestConfigService } from '../services/test-config-service';

export abstract class BasePage implements IPageObject, INavigationCapable {
  protected readonly configService: TestConfigService;

  constructor(protected page: Page, configService?: TestConfigService) {
    // Dependency Inversion Principle (DIP) - Depend on abstractions
    this.configService = configService || new TestConfigService();
  }

  // Abstract methods following SRP - each page defines its own behavior
  abstract navigateToPage(): Promise<void>;
  abstract isPageLoaded(): Promise<boolean>;
  abstract getPageIdentifier(): string;
  protected abstract waitForCriticalElements(): Promise<void>;

  // Common navigation methods implementing INavigationCapable
  async navigateToHome(): Promise<void> {
    await this.page.goto(this.configService.getBaseUrl());
  }

  async navigateToLogin(): Promise<void> {
    await this.page.goto(`${this.configService.getBaseUrl()}#/login`);
  }

  async navigateToRegister(): Promise<void> {
    await this.page.goto(`${this.configService.getBaseUrl()}#/register`);
  }

  // Helper method for error handling
  protected async handleError(operation: string, error: Error): Promise<void> {
    console.error(`Error during ${operation} on ${this.getPageIdentifier()}:`, error.message);
    throw new Error(`Failed to ${operation}: ${error.message}`);
  }

  // Common validation helper
  protected createValidationResult(isValid: boolean, errors: string[] = [], warnings: string[] = []): ValidationResult {
    return { isValid, errors, warnings };
  }
}