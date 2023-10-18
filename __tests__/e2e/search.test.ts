import {device, element, by, expect} from 'detox';
import app from './helpers/mockServer';
import demoProducts from './helpers/demoProducts.json';
import {Server} from 'http';
import {Product} from '../../components/ProductItem';

let server: Server;
describe('Search screen', () => {
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

  it('should load products on entering search term', async () => {
    const term = 'pellen';

    const toSearchBtn = element(by.id('search-btn'));
    await expect(toSearchBtn).toBeVisible();
    await toSearchBtn.tap();
    const searchField = element(by.id('search'));
    await expect(searchField).toBeVisible();

    await searchField.typeText(term);
    await searchField.tapReturnKey();

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
  });
});
