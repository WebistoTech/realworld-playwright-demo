import { Page } from '@playwright/test';
import { RegistrationPage } from '../pages/registration-page';
import { LoginPage } from '../pages/login-page';
import { TestConfigService } from '../services/test-config-service';

export class PageFactory {
  private static instance: PageFactory;
  private readonly configService: TestConfigService;

  private constructor() {
    this.configService = new TestConfigService();
  }

  // Singleton pattern for factory
  static getInstance(): PageFactory {
    if (!PageFactory.instance) {
      PageFactory.instance = new PageFactory();
    }
    return PageFactory.instance;
  }

  // Factory methods following Open/Closed Principle - easy to extend
  createRegistrationPage(page: Page): RegistrationPage {
    return new RegistrationPage(page, this.configService);
  }

  createLoginPage(page: Page): LoginPage {
    return new LoginPage(page, this.configService);
  }

  // Future page objects can be added here without modifying existing code
  // createHomePage(page: Page): HomePage { ... }
  // createArticlePage(page: Page): ArticlePage { ... }
  // createProfilePage(page: Page): ProfilePage { ... }

  getConfigService(): TestConfigService {
    return this.configService;
  }
}