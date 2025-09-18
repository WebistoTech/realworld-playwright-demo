import { Page, expect } from '@playwright/test';
import { ValidationResult } from '../interfaces/page-interfaces';

export class ValidationService {
  constructor(private page: Page) {}

  async validateAccessibility(): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check for proper heading structure
      const heading = this.page.getByRole('heading', { level: 1 });
      if (!(await heading.isVisible())) {
        errors.push('Missing H1 heading for accessibility');
      }

      // Check for form labels
      const formFields = await this.page.getByRole('textbox').all();
      for (const field of formFields) {
        const accessibleName = await field.getAttribute('aria-label') || await field.getAttribute('placeholder');
        if (!accessibleName) {
          warnings.push('Form field missing accessible name');
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        isValid: false,
        errors: [`Accessibility validation failed: ${errorMessage}`],
        warnings
      };
    }
  }

  async validateFormStructure(expectedFields: string[]): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      for (const fieldName of expectedFields) {
        const field = this.page.getByRole('textbox', { name: fieldName });
        if (!(await field.isVisible())) {
          errors.push(`Missing required field: ${fieldName}`);
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        isValid: false,
        errors: [`Form structure validation failed: ${errorMessage}`],
        warnings
      };
    }
  }

  async validateNavigationStructure(expectedLinks: string[]): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      for (const linkName of expectedLinks) {
        const link = this.page.getByRole('link', { name: linkName });
        if (!(await link.isVisible())) {
          errors.push(`Missing navigation link: ${linkName}`);
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        isValid: false,
        errors: [`Navigation validation failed: ${errorMessage}`],
        warnings
      };
    }
  }
}