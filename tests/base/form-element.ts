import { Locator, expect } from '@playwright/test';

export class FormElement {
  constructor(private locator: Locator) {}

  async fill(value: string): Promise<void> {
    try {
      await this.locator.fill(value);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fill form element: ${errorMessage}`);
    }
  }

  async click(): Promise<void> {
    try {
      await this.locator.click();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to click form element: ${errorMessage}`);
    }
  }

  async isVisible(): Promise<boolean> {
    return await this.locator.isVisible();
  }

  async isEnabled(): Promise<boolean> {
    return await this.locator.isEnabled();
  }

  async isDisabled(): Promise<boolean> {
    return await this.locator.isDisabled();
  }

  async expectToBeVisible(): Promise<void> {
    await expect(this.locator).toBeVisible();
  }

  async expectToBeEnabled(): Promise<void> {
    await expect(this.locator).toBeEnabled();
  }

  async expectToBeDisabled(): Promise<void> {
    await expect(this.locator).toBeDisabled();
  }

  async expectToHaveText(text: string): Promise<void> {
    await expect(this.locator).toHaveText(text);
  }

  async expectToContainText(text: string): Promise<void> {
    await expect(this.locator).toContainText(text);
  }

  async getValue(): Promise<string> {
    try {
      return await this.locator.inputValue();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get value from form element: ${errorMessage}`);
    }
  }

  // Allow access to underlying locator for advanced operations
  getLocator(): Locator {
    return this.locator;
  }
}