import { test, expect } from '@playwright/test';

test.describe('Login Page Analysis', () => {
  test('Analyze login page structure', async ({ page }) => {
    console.log('Navigating to login page...');
    await page.goto('https://demo.realworld.show/#/login');
    await page.waitForLoadState('networkidle');

    console.log('Analyzing page structure...');

    // Get page title
    const title = await page.title();
    console.log('Page Title:', title);

    // Get all input fields
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    console.log('Input fields found:', inputCount);

    for (let i = 0; i < inputCount; i++) {
      const type = await inputs.nth(i).getAttribute('type');
      const placeholder = await inputs.nth(i).getAttribute('placeholder');
      const name = await inputs.nth(i).getAttribute('name');
      console.log(`Input ${i + 1}: type=${type}, placeholder=${placeholder}, name=${name}`);
    }

    // Get all buttons
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    console.log('Buttons found:', buttonCount);

    for (let i = 0; i < buttonCount; i++) {
      const text = await buttons.nth(i).textContent();
      const type = await buttons.nth(i).getAttribute('type');
      console.log(`Button ${i + 1}: text=${text?.trim()}, type=${type}`);
    }

    // Get all links
    const links = page.locator('a');
    const linkCount = await links.count();
    console.log('Links found:', linkCount);

    for (let i = 0; i < linkCount; i++) {
      const text = await links.nth(i).textContent();
      const href = await links.nth(i).getAttribute('href');
      console.log(`Link ${i + 1}: text=${text?.trim()}, href=${href}`);
    }

    // Look for form elements
    const forms = await page.locator('form').count();
    console.log('Forms found:', forms);

    // Check for error message containers
    const errorElements = page.locator('[class*="error"], [class*="alert"], .text-danger');
    const errorCount = await errorElements.count();
    console.log('Potential error elements found:', errorCount);

    // Take a screenshot for reference
    await page.screenshot({ path: 'login-page-analysis.png', fullPage: true });
    console.log('Screenshot saved as login-page-analysis.png');

    // Additional analysis for login-specific elements
    const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]');
    const passwordInput = page.locator('input[type="password"]');
    const signInButton = page.locator('button:has-text("Sign in"), button[type="submit"]');

    console.log('Email input found:', await emailInput.count() > 0);
    console.log('Password input found:', await passwordInput.count() > 0);
    console.log('Sign in button found:', await signInButton.count() > 0);
  });
});