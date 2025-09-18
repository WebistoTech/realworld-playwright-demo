import { Page } from '@playwright/test';

// Interface Segregation Principle (ISP) - Focused interfaces
export interface IPageObject {
  navigateToPage(): Promise<void>;
  isPageLoaded(): Promise<boolean>;
  getPageIdentifier(): string;
}

export interface IFormInteraction {
  fillForm(data: Record<string, string>): Promise<void>;
  submitForm(): Promise<void>;
  isFormValid(): Promise<boolean>;
}

export interface INavigationCapable {
  navigateToHome(): Promise<void>;
  navigateToLogin(): Promise<void>;
  navigateToRegister(): Promise<void>;
}

export interface IValidatable {
  validatePageStructure(): Promise<ValidationResult>;
  validateAccessibility(): Promise<ValidationResult>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface RegistrationData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface TestStep {
  execute(description: string, action: () => Promise<void>): Promise<void>;
}