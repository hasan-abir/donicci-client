import {device, element, by, expect} from 'detox';
import app from './helpers/mockServer';
import demoProducts from './helpers/demoProducts.json';
import {Server} from 'http';
import {Product} from '../../components/ProductItem';

let server: Server;
describe('ProductDetails screen', () => {
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

  it('should load product and display all details', async () => {
    const flatlist = by.id('flat-list');

    const product = demoProducts.products[0];

    await element(by.id('product-image-' + product._id)).tap();

    const mainImage = element(by.id('gallery-image-main'));
    await expect(mainImage).toBeVisible();

    for (let i = 0; i < product.images.length; i++) {
      const image = element(by.id('gallery-image-' + (i + 1)));

      await waitFor(image)
        .toBeVisible()
        .whileElement(flatlist)
        .scroll(50, 'down');
    }

    await waitFor(element(by.id('title')))
      .toBeVisible()
      .whileElement(flatlist)
      .scroll(50, 'down');
    await waitFor(element(by.id('price')))
      .toBeVisible()
      .whileElement(flatlist)
      .scroll(50, 'down');

    for (let i = 0; i < product.categories_list.length; i++) {
      const category = element(
        by.id('category-' + product.categories_list[i]._id),
      );
      await waitFor(category)
        .toBeVisible()
        .whileElement(flatlist)
        .scroll(50, 'down');
      await expect(category).toHaveText(product.categories_list[i].name);
    }

    const quantity = element(by.id('quantity'));
    await waitFor(quantity)
      .toBeVisible()
      .whileElement(flatlist)
      .scroll(50, 'down');

    await expect(quantity).toHaveText('1 of ' + product.quantity);

    const increaseQuantity = element(by.id('increase-quantity'));
    await waitFor(increaseQuantity)
      .toBeVisible()
      .whileElement(flatlist)
      .scroll(50, 'down');
    await increaseQuantity.tap();
    await expect(quantity).toHaveText('2 of ' + product.quantity);

    const decreaseQuantity = element(by.id('decrease-quantity'));
    await waitFor(decreaseQuantity)
      .toBeVisible()
      .whileElement(flatlist)
      .scroll(50, 'down');
    await decreaseQuantity.tap();
    await expect(quantity).toHaveText('1 of ' + product.quantity);

    await waitFor(element(by.id('description')))
      .toBeVisible()
      .whileElement(flatlist)
      .scroll(50, 'down');
  });
});
