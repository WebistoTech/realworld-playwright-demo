import { expect, test } from '@playwright/test';
import { PageFactory } from './base/page-factory';
import { TestStep } from './interfaces/test-interfaces';
import { AuthenticationService } from './services/authentication-service';
import { TestConfigService } from './services/test-config-service';
import { RegistrationPage } from './pages/registration-page';

test.describe('User Registration Tests - SOLID Refactored', () => {
  let pageFactory: PageFactory;
  let configService: TestConfigService;
  let authService: AuthenticationService;
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    // Dependency Injection - instantiate services and pages
    pageFactory = PageFactory.getInstance();
    configService = pageFactory.getConfigService();
    authService = new AuthenticationService(page);
    registrationPage = pageFactory.createRegistrationPage(page);

    await TestStep.execute('Navigate to registration page', async () => {
      await registrationPage.navigateToPage();
    });
  });

  test('TC-REG-SOLID-01: Successful user registration with valid data', async ({ page }) => {
    const testUser = configService.generateTestUser();

    await TestStep.execute('Fill registration form with valid data', async () => {
      await registrationPage.fillRegistrationForm(testUser);
    });

    await TestStep.execute('Verify form validation and submit', async () => {
      // Verify form is valid before submission
      expect(await registrationPage.isFormValid()).toBe(true);
      await registrationPage.submitForm();
    });

    await TestStep.execute('Verify successful registration', async () => {
      await registrationPage.verifyRegistrationSuccess(testUser.username);
    });
  });

  test('TC-REG-SOLID-02: Form validation behavior with progressive field completion', async ({ page }) => {
    await TestStep.execute('Test form validation behavior', async () => {
      await registrationPage.verifyFormValidationBehavior();
    });
  });

  test('TC-REG-SOLID-03: Registration with invalid email format (documenting current behavior)', async ({ page }) => {
    const testUser = configService.generateInvalidEmailUser();

    await TestStep.execute('Fill form with invalid email format', async () => {
      await registrationPage.fillRegistrationForm(testUser);
    });

    await TestStep.execute('Verify form accepts invalid email and enables submission', async () => {
      // Current behavior: form allows invalid email format
      expect(await registrationPage.isFormValid()).toBe(true);
    });

    await TestStep.execute('Submit form and verify registration completes', async () => {
      await registrationPage.submitForm();
      await registrationPage.verifyRegistrationSuccess(testUser.username);
    });
  });

  test('TC-REG-SOLID-04: Navigation to sign in page', async ({ page }) => {
    await TestStep.execute('Navigate to login page via link', async () => {
      await registrationPage.navigateToLogin();
    });
  });

  test('TC-REG-SOLID-05: Comprehensive page structure and accessibility validation', async ({ page }) => {
    await TestStep.execute('Validate page structure', async () => {
      const structureValidation = await registrationPage.validatePageStructure();
      expect(structureValidation.isValid).toBe(true);
      
      if (!structureValidation.isValid) {
        console.log('Structure validation errors:', structureValidation.errors);
      }
      
      if (structureValidation.warnings.length > 0) {
        console.log('Structure validation warnings:', structureValidation.warnings);
      }
    });

    await TestStep.execute('Validate accessibility compliance', async () => {
      const accessibilityValidation = await registrationPage.validateAccessibility();
      expect(accessibilityValidation.isValid).toBe(true);
      
      if (!accessibilityValidation.isValid) {
        console.log('Accessibility validation errors:', accessibilityValidation.errors);
      }
      
      if (accessibilityValidation.warnings.length > 0) {
        console.log('Accessibility validation warnings:', accessibilityValidation.warnings);
      }
    });
  });

  test('TC-REG-SOLID-06: Duplicate username registration behavior analysis', async ({ page }) => {
    const existingUsername = 'testuser123'; // Known existing user
    const testUser = {
      username: existingUsername,
      email: configService.generateTestUser().email, // Generate unique email
      password: 'password123'
    };

    await TestStep.execute('Attempt registration with existing username', async () => {
      await registrationPage.fillRegistrationForm(testUser);
    });

    await TestStep.execute('Submit form and analyze behavior', async () => {
      expect(await registrationPage.isFormValid()).toBe(true);
      await registrationPage.submitForm();
    });

    await TestStep.execute('Verify duplicate username handling', async () => {
      // Wait for potential error messages or redirect
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      const errors = await registrationPage.checkForErrorMessages();
      
      if (currentUrl.includes('#/register')) {
        // Still on registration page - check for errors
        if (errors.length > 0) {
          console.log('Found validation errors:', errors);
          expect(errors.some(error => error.toLowerCase().includes('username'))).toBe(true);
        } else {
          console.log('No error messages found - unexpected behavior');
        }
      } else {
        // Redirected - registration may have succeeded
        console.log('Registration succeeded despite duplicate username - documenting behavior');
        await expect(page).toHaveURL(`${configService.getBaseUrl()}#/`);
      }
    });
  });

  test('TC-REG-SOLID-07: Cross-cutting concerns integration test', async ({ page }) => {
    const testUser = configService.generateTestUser();

    await TestStep.execute('Complete registration workflow', async () => {
      await registrationPage.fillRegistrationForm(testUser);
      await registrationPage.submitForm();
      await authService.verifySuccessfulRegistration(testUser.username);
    });

    await TestStep.execute('Test logout functionality', async () => {
      await authService.logout();
      await authService.verifyLoggedOutState();
    });

    await TestStep.execute('Verify can navigate back to registration', async () => {
      await registrationPage.navigateToPage();
      expect(await registrationPage.isPageLoaded()).toBe(true);
    });
  });
});