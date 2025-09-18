import { RegistrationData } from '../interfaces/page-interfaces';

export class TestConfigService {
  private readonly baseUrl: string;
  private readonly defaultTimeout: number;

  constructor() {
    this.baseUrl = 'https://demo.realworld.show/';
    this.defaultTimeout = 30000;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getDefaultTimeout(): number {
    return this.defaultTimeout;
  }

  getRegistrationUrl(): string {
    return `${this.baseUrl}#/register`;
  }

  getLoginUrl(): string {
    return `${this.baseUrl}#/login`;
  }

  generateTestUser(timestamp?: number): RegistrationData {
    const ts = timestamp || Date.now();
    return {
      username: `testuser${ts}`,
      email: `testuser${ts}@example.com`,
      password: 'password123'
    };
  }

  generateInvalidEmailUser(timestamp?: number): RegistrationData {
    const ts = timestamp || Date.now();
    return {
      username: `testuser${ts}`,
      email: 'invalid-email-format',
      password: 'password123'
    };
  }
}