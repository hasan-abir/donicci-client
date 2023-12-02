import {device, element, by, expect} from 'detox';
import app from './helpers/mockServer';
import {Server} from 'http';

let server: Server;
describe('Register screen', () => {
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

  it('should register and redirect to home', async () => {
    const display_name = 'Example User';
    const username = 'example_test123';
    const email = 'example@test.com';
    const password = 'testtest';

    const toLoginBtn = element(by.id('login-btn'));
    await expect(toLoginBtn).toBeVisible();
    await toLoginBtn.tap();

    const toRegisterBtn = element(by.id('register-btn'));
    await expect(toRegisterBtn).toBeVisible();
    await toRegisterBtn.tap();
    const displayNameField = element(by.id('display_name'));
    const usernameField = element(by.id('username'));
    const emailField = element(by.id('email'));
    const passwordField = element(by.id('password'));
    const submitBtn = element(by.id('submit-btn'));

    await expect(displayNameField).toBeVisible();
    await expect(usernameField).toBeVisible();
    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(submitBtn).toBeVisible();
    await submitBtn.tap();
    await expect(element(by.text('This is wrong'))).toBeVisible();
    await expect(element(by.text('That is wrong'))).toBeVisible();
    await displayNameField.typeText(display_name);
    await usernameField.typeText(username);
    await emailField.typeText(email);
    await element(by.id('register-screen')).scrollTo('bottom');
    await passwordField.typeText(password);
    await submitBtn.multiTap(2);
    await expect(element(by.id('user-greeting'))).toHaveText(
      'Welcome, Example User!',
    );
  });
});
