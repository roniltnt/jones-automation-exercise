const { test, expect } = require('@playwright/test');
const { CallbackPage } = require('../pages/callbackPage');

const TEST_DATA = {
  name: 'Leonard Cohen',
  email: 'Leonard.Cohen@example.com',
  phone: '+1-365-666-2000',
  company: 'Legend Corporation',
  website: 'https://www.legend-example.com',
};

test.describe('Callback Form', () => {
  test('should successfully fill and submit the callback form', async ({ page }) => {
    const callbackPage = new CallbackPage(page);

    await callbackPage.navigate();

    await callbackPage.fillForm(TEST_DATA);

    await callbackPage.selectEmployeeRange();

    await callbackPage.takeScreenshot('before-submit');

    await callbackPage.submit();

    const thankYouReached = await callbackPage.waitForThankYou();

    console.log(`Thank you page reached: ${thankYouReached}`);

    expect(thankYouReached).toBe(true);

    expect(page.url()).toMatch(/thank-you/i);

    const headerText = await callbackPage.getThankYouHeaderText();
    
    expect(headerText).toMatch(/Thank You/i);
  });
});
