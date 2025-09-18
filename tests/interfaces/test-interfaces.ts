import { test } from '@playwright/test';

export class TestStep {
  static async execute(description: string, action: () => Promise<void>): Promise<void> {
    return test.step(description, action);
  }
}