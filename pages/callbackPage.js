const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://test.netlify.app/';

const SELECTORS = {
  name: 'input[name="name"]',
  email: 'input[name="email"]',
  phone: 'input[name="phone"]',
  company: 'input[name="company"]',
  website: 'input[name="website"]',
  employees: 'select[name="number_of_employees"]',
};

const EMPLOYEES_TARGET = '51-500';
const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots');

/**
 * Page Object Model (POM) for the Callback Form.
 * Encapsulates all UI locators and user actions.
 */
class CallbackPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.nameInput = page.locator(SELECTORS.name);
    this.emailInput = page.locator(SELECTORS.email);
    this.phoneInput = page.locator(SELECTORS.phone);
    this.companyInput = page.locator(SELECTORS.company);
    this.websiteInput = page.locator(SELECTORS.website);
    this.employeesDropdown = page.locator(SELECTORS.employees);
    this.submitButton = page.getByRole('button', { name: /request a call back/i });
    this.thankYouHeader = page.locator('h1');
  }

  async navigate() {
    await this.page.goto(BASE_URL);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * @param {{ name: string; email: string; phone: string; company: string; website: string }} data
   */
  async fillForm(data) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);
    await this.companyInput.fill(data.company);
    await this.websiteInput.fill(data.website);
  }

  /**
   * Bonus requirement: Updates the employee count dropdown.
   * Includes a robust validation check to ensure the DOM registered the change.
   */
  async selectEmployeeRange() {
    await this.employeesDropdown.selectOption(EMPLOYEES_TARGET);

    const selected = await this.employeesDropdown.inputValue();
    if (selected !== EMPLOYEES_TARGET) {
      throw new Error(
        `Employees dropdown did not update. Expected "${EMPLOYEES_TARGET}", got "${selected}".`
      );
    }
  }

  /**
   * Captures a full-page screenshot for debugging and auditing purposes.
   * Uses dynamic ISO timestamps to prevent file overwriting.
   * @param {string} label - A descriptive prefix for the generated image file.
   */
  async takeScreenshot(label = 'before-submit') {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(SCREENSHOTS_DIR, `${label}-${timestamp}.png`);

    await this.page.screenshot({ path: filePath, fullPage: true });
    console.log(`Screenshot saved: ${filePath}`);
    return filePath;
  }

  async submit() {
    await this.submitButton.click();
  }

  async waitForThankYou() {
    await this.page.waitForURL(/thank-you/i, { timeout: 15_000 });

    const currentUrl = this.page.url();
    console.log(`Thank you page reached. Current URL: ${currentUrl}`);
    return true;
  }

  async getThankYouHeaderText() {
    return await this.thankYouHeader.innerText();
  }
}

module.exports = { CallbackPage };
