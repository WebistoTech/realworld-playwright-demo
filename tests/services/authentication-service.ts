import { Page, expect } from '@playwright/test';
import { RegistrationData } from '../interfaces/page-interfaces';

export class AuthenticationService {
  constructor(private page: Page) {}

  async verifySuccessfulRegistration(username: string): Promise<void> {
    // Verify redirect to home page
    await expect(this.page).toHaveURL('https://demo.realworld.show/#/');
    
    // Verify user-specific navigation elements
    await expect(this.page.getByRole('link', { name: 'New Article' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Settings' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: username })).toBeVisible();
  }

  async logout(): Promise<void> {
    // Navigate to settings page
    await this.page.getByRole('link', { name: 'Settings' }).click();
    
    // Click logout button
    await this.page.getByRole('button', { name: 'Or click here to logout.' }).click();
    
    // Verify logout success
    await expect(this.page).toHaveURL('https://demo.realworld.show/#/');
    await expect(this.page.getByRole('link', { name: 'Sign in' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Sign up' })).toBeVisible();
  }

  async verifyLoggedOutState(): Promise<void> {
    await expect(this.page.getByRole('link', { name: 'Sign in' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Sign up' })).toBeVisible();
  }

  async verifyLoggedInState(): Promise<boolean> {
    try {
      // Check for presence of user-specific elements that indicate logged-in state
      const newArticleLink = this.page.getByRole('link', { name: 'New Article' });
      const settingsLink = this.page.getByRole('link', { name: 'Settings' });

      const hasNewArticle = await newArticleLink.isVisible();
      const hasSettings = await settingsLink.isVisible();

      return hasNewArticle && hasSettings;
    } catch {
      return false;
    }
  }
}