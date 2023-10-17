import {device, element, by, expect} from 'detox';
import app from './helpers/mockServer';
import demoProducts from './helpers/demoProducts.json';
import {Server} from 'http';
import {Product} from '../../components/ProductItem';

let server: Server;
describe('Productlist screen', () => {
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

  it('should refresh bad token and load user', async () => {
    const email = 'example@test.com';
    const password = 'currentuser';

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
    await device.reloadReactNative();
    await expect(element(by.id('user-greeting'))).toHaveText(
      'Welcome, Example User!',
    );
    const logoutBtn = element(by.id('logout-btn'));
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.tap();
    await expect(toLoginBtn).toBeVisible();
  });

  it('should load user on mount', async () => {
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
    await device.reloadReactNative();
    await expect(element(by.id('user-greeting'))).toHaveText(
      'Welcome, Example User!',
    );
    const logoutBtn = element(by.id('logout-btn'));
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.tap();
    await expect(toLoginBtn).toBeVisible();
  });
  it('should load products and more on scroll', async () => {
    const productsData = demoProducts.products as Product[];
    const flatlist = by.id('flat-list');

    for (let i = 0; i < productsData.length; i++) {
      const imageEl = element(by.id('product-image-' + productsData[i]._id));
      const titleEl = element(by.id('product-title-' + productsData[i]._id));
      const ratingsEl = element(by.id('product-rating-' + productsData[i]._id));
      const priceEl = element(by.id('product-price-' + productsData[i]._id));

      await waitFor(imageEl)
        .toBeVisible()
        .whileElement(flatlist)
        .scroll(50, 'down');

      await waitFor(titleEl)
        .toBeVisible()
        .whileElement(flatlist)
        .scroll(50, 'down');

      await expect(ratingsEl).toBeVisible();

      await waitFor(priceEl)
        .toBeVisible()
        .whileElement(flatlist)
        .scroll(50, 'down');
    }

    await expect(element(by.id('end-of-data-text'))).toBeVisible;

    await element(flatlist).scrollTo('top');
    await element(flatlist).swipe('down', 'fast');

    for (let i = 0; i < 5; i++) {
      const imageEl = element(by.id('product-image-' + productsData[i]._id));

      await waitFor(imageEl)
        .toBeVisible()
        .whileElement(flatlist)
        .scroll(50, 'down');
    }

    await expect(element(by.id('end-of-data-text'))).toBeVisible;
  });
});
