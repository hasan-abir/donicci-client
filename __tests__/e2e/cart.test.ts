import {device, element, by, expect} from 'detox';
import app from './helpers/mockServer';
import demoProducts from './helpers/demoProducts.json';
import demoCartItems from './helpers/demoCartItems.json';
import {Server} from 'http';
import utilities from './helpers/utilities';

let server: Server;
describe('Cart screen', () => {
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

  it('should add and remove from product details (without auth)', async () => {
    const product = demoProducts.products[0];

    await element(by.id('product-image-' + product._id)).tap();

    const scrollview = by.id('scrollview');

    const addToCartBtn = element(by.id('add-to-cart'));
    const removeFromCartBtn = element(by.id('remove-from-cart'));
    const increaseQuantity = element(by.id('increase-quantity'));

    await waitFor(increaseQuantity)
      .toBeVisible()
      .whileElement(scrollview)
      .scroll(50, 'down');
    await increaseQuantity.tap();
    await waitFor(addToCartBtn)
      .toBeVisible()
      .whileElement(scrollview)
      .scroll(50, 'down');
    await addToCartBtn.tap();
    const backBtn = element(by.id('back-btn'));
    await expect(backBtn).toBeVisible();
    await backBtn.tap();
    const cartItemsLength = element(by.id('cart-items-length'));
    await expect(cartItemsLength).toBeVisible();
    await expect(cartItemsLength).toHaveText('1');

    const cartBtn = element(by.id('Cart-btn'));
    await expect(cartBtn).toBeVisible();
    await cartBtn.tap();

    const itemTitle = element(by.id('item-' + product._id + '-title'));
    const itemQuantity = element(by.id('item-' + product._id + '-quantity'));

    await expect(itemTitle).toBeVisible();
    await expect(itemTitle).toHaveText(product.title);
    await expect(itemQuantity).toBeVisible();
    await expect(itemQuantity).toHaveText('2 of ' + product.quantity);

    await element(by.id('Products-btn')).tap();

    await element(by.id('product-image-' + product._id)).tap();

    await waitFor(removeFromCartBtn)
      .toBeVisible()
      .whileElement(scrollview)
      .scroll(50, 'down');

    await removeFromCartBtn.tap();

    await expect(addToCartBtn).toBeVisible();

    await backBtn.tap();
    await expect(cartItemsLength).not.toBeVisible();
  });

  it('should display user cart items (with auth)', async () => {
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
    await submitBtn.multiTap(2);
    await expect(element(by.id('user-greeting'))).toHaveText(
      'Welcome, Example User!',
    );

    const product = demoProducts.products[0];

    await element(by.id('product-image-' + product._id)).tap();

    const scrollview = by.id('scrollview');
    const flatlist = by.id('flat-list');

    const addToCartBtn = element(by.id('add-to-cart'));
    const removeFromCartBtn = element(by.id('remove-from-cart'));

    await waitFor(addToCartBtn)
      .toBeVisible()
      .whileElement(scrollview)
      .scroll(50, 'down');
    const backBtn = element(by.id('back-btn'));
    await expect(backBtn).toBeVisible();
    await backBtn.tap();

    const thirdProduct = demoProducts.products[2];
    await waitFor(element(by.id('product-image-' + thirdProduct._id)))
      .toBeVisible()
      .whileElement(flatlist)
      .scroll(50, 'down');

    await element(by.id('product-image-' + demoProducts.products[2]._id)).tap();

    await waitFor(removeFromCartBtn)
      .toBeVisible()
      .whileElement(scrollview)
      .scroll(50, 'down');
    await backBtn.tap();

    const cartBtn = element(by.id('Cart-btn'));
    await expect(cartBtn).toBeVisible();
    await cartBtn.tap();

    const cartItems = demoCartItems.cartItems;
    for (let i = 0; i < cartItems.length; i++) {
      const itemTitle = element(
        by.id('item-' + cartItems[i].product_id + '-title'),
      );

      await waitFor(itemTitle)
        .toBeVisible()
        .whileElement(flatlist)
        .scroll(50, 'down');
    }
  });

  it('should crud from cart with correct prices (without auth)', async () => {
    const firstProduct = demoProducts.products[0];
    const secondProduct = demoProducts.products[2];

    await element(by.id('product-image-' + firstProduct._id)).tap();

    const scrollview = by.id('scrollview');
    const flatlist = by.id('flat-list');

    const addToCartBtn = element(by.id('add-to-cart'));

    await waitFor(addToCartBtn)
      .toBeVisible()
      .whileElement(scrollview)
      .scroll(50, 'down');
    await addToCartBtn.tap();
    const backBtn = element(by.id('back-btn'));
    await expect(backBtn).toBeVisible();
    await backBtn.tap();

    await waitFor(element(by.id('product-image-' + secondProduct._id)))
      .toBeVisible()
      .whileElement(flatlist)
      .scroll(50, 'down');

    await element(by.id('product-image-' + secondProduct._id)).tap();

    await waitFor(addToCartBtn)
      .toBeVisible()
      .whileElement(scrollview)
      .scroll(50, 'down');
    await addToCartBtn.tap();
    await backBtn.tap();

    const cartBtn = element(by.id('Cart-btn'));
    await expect(cartBtn).toBeVisible();
    await cartBtn.tap();

    const firstProductTotal = element(
      by.id('item-' + firstProduct._id + '-total'),
    );
    const secondProductTotal = element(
      by.id('item-' + secondProduct._id + '-total'),
    );
    const subtotal = element(by.id('subtotal'));
    const tax = element(by.id('tax'));
    const total = element(by.id('total'));
    const clearCart = element(by.id('clear-cart-btn'));
    const noItems = element(by.id('no-items-text'));
    const firstProductIncreaseQuantity = element(
      by.id('item-' + firstProduct._id + '-increase-quantity'),
    );
    const firstProductDecreaseQuantity = element(
      by.id('item-' + firstProduct._id + '-decrease-quantity'),
    );
    const firstProductRemove = element(
      by.id('item-' + firstProduct._id + '-remove'),
    );

    await expect(firstProductTotal).toBeVisible();
    await expect(firstProductTotal).toHaveText(
      '$' + firstProduct.price.toString(),
    );

    await expect(secondProductTotal).toBeVisible();
    await expect(secondProductTotal).toHaveText(
      '$' + secondProduct.price.toString(),
    );

    await expect(subtotal).toBeVisible();
    await expect(subtotal).toHaveText('$70');
    await expect(tax).toBeVisible();
    await expect(tax).toHaveText('$4');
    await expect(total).toBeVisible();
    await expect(total).toHaveText('$74');

    await expect(firstProductIncreaseQuantity).toBeVisible();
    await firstProductIncreaseQuantity.tap();
    await expect(firstProductTotal).toHaveText(
      '$' + (firstProduct.price * 2).toString(),
    );
    await expect(subtotal).toHaveText('$100');
    await expect(tax).toHaveText('$5');
    await expect(total).toHaveText('$105');
    await expect(firstProductDecreaseQuantity).toBeVisible();
    await firstProductDecreaseQuantity.tap();
    await expect(firstProductTotal).toHaveText(
      '$' + firstProduct.price.toString(),
    );
    await expect(total).toHaveText('$74');

    await expect(firstProductRemove).toBeVisible();
    await firstProductRemove.tap();
    await expect(firstProductTotal).not.toBeVisible();
    await expect(total).toHaveText('$42');

    await waitFor(clearCart)
      .toBeVisible()
      .whileElement(scrollview)
      .scroll(50, 'down');
    await clearCart.tap();
    await expect(noItems).toBeVisible();
  });
});
