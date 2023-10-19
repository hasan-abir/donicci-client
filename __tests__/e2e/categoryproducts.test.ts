import {device, element, by, expect} from 'detox';
import app from './helpers/mockServer';
import demoProducts from './helpers/demoProducts.json';
import demoCategories from './helpers/demoCategories.json';
import {Server} from 'http';
import {Category} from '../../components/CategoryItem';
import {Product} from '../../components/ProductItem';

let server: Server;
describe('CategoryProducts screen', () => {
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

  it('should fetch category and display products', async () => {
    const category: Category = demoCategories.categories[0];

    const toCategoriesBtn = element(by.id('Categories-btn'));
    await expect(toCategoriesBtn).toBeVisible();
    await toCategoriesBtn.tap();
    await expect(element(by.id('main-heading'))).toBeVisible();

    const titleEl = element(by.id('category-title-' + category._id));
    await waitFor(titleEl).toBeVisible();
    await titleEl.tap();

    await expect(element(by.id('main-heading'))).toHaveText(category.name);

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

  it('should show error when product not found', async () => {
    const category: Category = demoCategories.categories[1];

    const toCategoriesBtn = element(by.id('Categories-btn'));
    await expect(toCategoriesBtn).toBeVisible();
    await toCategoriesBtn.tap();
    await expect(element(by.id('main-heading'))).toBeVisible();

    const titleEl = element(by.id('category-title-' + category._id));
    await waitFor(titleEl).toBeVisible();
    await titleEl.tap();

    await expect(element(by.id('not-found-text'))).toBeVisible();
    await element(by.id('backtocategories-btn')).tap();
    await expect(element(by.id('main-heading'))).toBeVisible();
  });
});
