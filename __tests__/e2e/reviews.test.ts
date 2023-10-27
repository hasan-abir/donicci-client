import {by, device, element, expect} from 'detox';
import {Server} from 'http';
import demoProducts from './helpers/demoProducts.json';
import demoReviews from './helpers/demoReviews.json';
import app from './helpers/mockServer';
import utilities from './helpers/utilities';

let server: Server;
describe('Reviews screen', () => {
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

    const isLoggedIn = await utilities.expectToBeVisible('logout-btn');

    if (isLoggedIn) {
      await element(by.id('logout-btn')).tap();
      await expect(element(by.id('login-btn'))).toBeVisible();
    }
  });

  it('should load reviews', async () => {
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

    const scrollview = by.id('scrollview');

    const product = demoProducts.products[0];

    await element(by.id('product-image-' + product._id)).tap();

    const mainImage = element(by.id('gallery-image-main'));
    await waitFor(mainImage).toBeVisible().withTimeout(30000);

    const toReviewsBtn = element(by.id('to-reviews-btn'));

    await element(scrollview).scrollTo('bottom');
    await expect(toReviewsBtn).toBeVisible();
    await toReviewsBtn.tap();

    const reviews = demoReviews.reviews;

    const flatlist = by.id('flat-list');

    for (let i = 0; i < reviews.length; i++) {
      const reviewDescription = element(
        by.id('review-description-' + reviews[i]._id),
      );
      const reviewAuthor = element(by.id('review-author-' + reviews[i]._id));
      await waitFor(reviewAuthor)
        .toBeVisible()
        .whileElement(flatlist)
        .scroll(50, 'down');
      await expect(reviewAuthor).toHaveText(reviews[i].author + ' says,');
      await waitFor(reviewDescription)
        .toBeVisible()
        .whileElement(flatlist)
        .scroll(50, 'down');
      await expect(reviewDescription).toHaveText(reviews[i].description);
    }

    await expect(element(by.id('end-of-data-text'))).toBeVisible;
  });

  it('should post new ones', async () => {
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

    const scrollview = by.id('scrollview');

    const product = demoProducts.products[0];

    await element(by.id('product-image-' + product._id)).tap();

    const mainImage = element(by.id('gallery-image-main'));
    await waitFor(mainImage).toBeVisible().withTimeout(30000);

    const toReviewsBtn = element(by.id('to-reviews-btn'));

    await element(scrollview).scrollTo('bottom');
    await expect(toReviewsBtn).toBeVisible();
    await toReviewsBtn.tap();

    const flatlist = by.id('flat-list');

    const reviewInput = element(by.id('review-input'));
    const reviewSubmit = element(by.id('review-submit'));

    await expect(reviewInput).toBeVisible();
    await expect(reviewSubmit).toBeVisible();

    await reviewInput.typeText(' ');
    await reviewSubmit.tap();
    await expect(element(by.text('Description is wrong'))).toBeVisible();
    await reviewInput.typeText('Some description');
    await reviewSubmit.tap();
    await expect(element(by.text('Description is wrong'))).not.toBeVisible();

    await waitFor(element(by.id('review-author-123')))
      .toBeVisible()
      .withTimeout(30000);

    await waitFor(element(by.id('review-description-123')))
      .toBeVisible()
      .whileElement(flatlist)
      .scroll(50, 'down');
  });

  it('should not post review without auth', async () => {
    const product = demoProducts.products[0];

    await element(by.id('product-image-' + product._id)).tap();

    const mainImage = element(by.id('gallery-image-main'));
    await waitFor(mainImage).toBeVisible().withTimeout(30000);

    const toReviewsBtn = element(by.id('to-reviews-btn'));

    const scrollview = by.id('scrollview');

    await element(scrollview).scrollTo('bottom');
    await expect(toReviewsBtn).toBeVisible();
    await toReviewsBtn.tap();

    const reviewInput = element(by.id('review-input'));
    const reviewSubmit = element(by.id('review-submit'));
    await expect(reviewInput).toBeVisible();
    await expect(reviewSubmit).toBeVisible();

    await reviewInput.typeText('Lorem');
    await reviewSubmit.tap();

    await waitFor(element(by.id('email')))
      .toBeVisible()
      .withTimeout(30000);
  });
});
