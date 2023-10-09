import {device, element, by, expect} from 'detox';
import app from './helpers/mockServer';
import {Server} from 'http';

let server: Server;
describe('Login screen', () => {
  beforeAll(async () => {
    await new Promise<void>(function (resolve) {
      server = app.listen(3000, () => {
        console.log(
          ` Running server on '${JSON.stringify(server.address())}'...`,
        );
        resolve();
      });
    });
  });

  afterAll(async () => {
    server.close();
  });

  beforeEach(async () => {
    await device.launchApp({newInstance: true});
  });

  it('should not login and show error', async () => {
    const toLoginBtn = element(by.id('login-btn'));
    await expect(toLoginBtn).toBeVisible();
    await toLoginBtn.tap();
    const submitBtn = element(by.id('submit-btn'));
    await submitBtn.tap();
    await expect(element(by.text('Unauthenticated'))).toBeVisible;
  });

  it('should login and redirect to home', async () => {
    const email = 'example@test.com';
    const password = 'testtest';

    const toLoginBtn = element(by.id('login-btn'));
    await expect(toLoginBtn).toBeVisible();
    await toLoginBtn.tap();
    const emailField = element(by.id('email'));
    const passwordField = element(by.id('password'));
    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await emailField.typeText(email);
    await passwordField.typeText(password);
    const submitBtn = element(by.id('submit-btn'));
    await submitBtn.tap();
    await expect(element(by.id('user-greeting'))).toHaveText(
      'Welcome, Example User!',
    );
  });
});
