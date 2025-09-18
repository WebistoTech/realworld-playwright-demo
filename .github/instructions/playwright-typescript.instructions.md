---
mode: agent
description: 'Generate a Playwright test based on a scenario using Playwright MCP, then refactor using SOLID principles and PageObject model'
tools: ['changes', 'codebase', 'editFiles', 'fetch', 'findTestFiles', 'problems', 'runCommands', 'runTasks', 'runTests', 'search', 'searchResults', 'terminalLastCommand', 'terminalSelection', 'testFailure', 'playwright']
model: 'Claude Sonnet 4'
applyTo: '**'
---

# Test Generation with Playwright MCP and SOLID Refactoring

Your goal is to generate a Playwright test based on the provided scenario, then apply SOLID principles and Clean Code practices to create maintainable, extensible test architecture.

## Phase 1: Test Generation

### Initial Test Creation
- You are given a scenario, and you need to generate a playwright test for it. If the user does not provide a scenario, you will ask them to provide one.
- DO NOT generate test code prematurely or based solely on the scenario without completing all prescribed steps.
- DO run steps one by one using the tools provided by the Playwright MCP.
- Only after all steps are completed, emit a Playwright TypeScript test that uses `@playwright/test` based on message history
- Save generated test file in the tests directory
- Execute the test file and iterate until the test passes

## Phase 2: SOLID Refactoring with WG Code Alchemist

After the initial test passes, transform it using Clean Code principles and SOLID design:

### Architecture Transformation
1. **Single Responsibility Principle (SRP)**
   - Extract page interactions into dedicated PageObject classes
   - Separate test logic from page manipulation
   - Create focused service classes for specific concerns (auth, data, validation)

2. **Open/Closed Principle (OCP)**
   - Design PageObjects that are extensible without modification
   - Use interfaces for different page interaction strategies
   - Enable easy addition of new test scenarios without changing existing code

3. **Liskov Substitution Principle (LSP)**
   - Ensure all PageObjects can be substituted through common interfaces
   - Create consistent base classes that derived pages can properly extend

4. **Interface Segregation Principle (ISP)**
   - Define focused interfaces for specific page capabilities (IFormInteraction, INavigationCapable, IValidatable)
   - Avoid large, monolithic page interfaces

5. **Dependency Inversion Principle (DIP)**
   - Inject dependencies (services, configurations) into PageObjects
   - Depend on abstractions rather than concrete implementations

### Refactoring Steps

#### Step 1: Analyze Current Test Structure
```typescript
// Before refactoring, analyze the generated test for:
// - Direct page interactions that can be encapsulated
// - Repeated patterns that can be abstracted
// - Hard-coded selectors and data that can be externalized
// - Authentication logic that can be serviced
```

#### Step 2: Create PageObject Architecture
```typescript
// Create base page class following the pattern:
export abstract class BasePage implements IPageObject {
  constructor(protected page: Page) {}
  abstract navigateToPage(): Promise<void>;
  abstract isPageLoaded(): Promise<boolean>;
  abstract getPageIdentifier(): string;
  protected abstract waitForCriticalElements(): Promise<void>;
}

// Create specific page classes:
export class [FeatureName]Page extends BasePage {
  // Encapsulate all page-specific interactions
  // Use FormElement wrappers for consistent behavior
  // Implement validation methods
}
```

#### Step 3: Extract Services
```typescript
// Create service classes for cross-cutting concerns:
export class AuthenticationService {
  async authenticate(page: Page, strategy: string): Promise<void>
}

export class TestConfigService {
  getBaseUrl(): string
  getCredentials(): LoginCredentials
}

export class ValidationService {
  async validateAccessibility(page: Page): Promise<void>
}
```

#### Step 4: Implement Dependency Injection
```typescript
// Transform tests to use dependency injection:
test.describe('Feature Tests', () => {
  let pageFactory: PageFactory;
  let authService: AuthenticationService;
  let featurePage: FeaturePage;

  test.beforeEach(async ({ page }) => {
    // Inject dependencies
    authService = new AuthenticationService();
    pageFactory = PageFactory.getInstance();
    featurePage = pageFactory.createFeaturePage(page);
  });
});
```

#### Step 5: Apply Clean Code Practices
- **Descriptive Naming**: Use intention-revealing names for all methods and variables
- **Small Functions**: Keep test steps focused and single-purpose
- **DRY Principle**: Extract common patterns into reusable methods
- **Error Handling**: Implement robust error handling with meaningful messages
- **Documentation**: Add clear comments explaining complex test logic

### Code Quality Standards

#### Test Structure Template
```typescript
import { expect, test } from '@playwright/test';
import { PageFactory } from './base/page-factory';
import { TestStep } from './interfaces/test-interfaces';
import { AuthenticationService } from './services/authentication-service';

test.describe('[Feature Name] Tests', () => {
  let authService: AuthenticationService;
  let pageFactory: PageFactory;
  let featurePage: FeaturePage;

  test.beforeEach(async ({ page }) => {
    // Dependency Injection
    authService = new AuthenticationService();
    pageFactory = PageFactory.getInstance();
    featurePage = pageFactory.createFeaturePage(page);

    await TestStep.execute('Setup and authentication', async () => {
      await featurePage.navigateToPage();
      await authService.authenticate(page, 'direct');
    });
  });

  test('TC-XXX-01: [Descriptive test name]', async ({ page }) => {
    await TestStep.execute('[Step description]', async () => {
      // Test implementation using PageObject methods
    });
  });
});
```

#### PageObject Template
```typescript
export class FeaturePage extends BasePage {
  private readonly authService: AuthenticationService;

  constructor(page: Page, authService?: AuthenticationService) {
    super(page);
    this.authService = authService || new AuthenticationService();
  }

  // Private element getters using FormElement pattern
  private get primaryElement(): FormElement {
    return new FormElement(this.page.getByRole('...'));
  }

  // Public interaction methods
  async performAction(): Promise<void> {
    await this.primaryElement.click();
  }

  // Validation methods
  async validateState(): Promise<ValidationResult> {
    // Return structured validation results
  }
}
```

### Refactoring Validation Checklist
- [ ] All page interactions are encapsulated in PageObject classes
- [ ] Services handle cross-cutting concerns (auth, config, validation)
- [ ] Dependency injection is used throughout
- [ ] Interfaces define clear contracts
- [ ] Tests are focused on business logic, not implementation details
- [ ] Code follows Clean Code naming conventions
- [ ] Error handling is robust and informative
- [ ] Tests are maintainable and extensible
- [ ] SOLID principles are consistently applied
- [ ] Documentation explains complex interactions

### Final Deliverables
1. **Refactored Test File**: Clean, maintainable test using PageObject pattern
2. **PageObject Classes**: Focused classes following SOLID principles
3. **Service Classes**: Reusable services for common functionality
4. **Interface Definitions**: Clear contracts for extensibility
5. **Documentation**: Comments explaining architectural decisions

Remember: The goal is not just working tests, but tests that are a joy to maintain and extend. Every refactoring should make the codebase more elegant, readable, and resilient to change.
