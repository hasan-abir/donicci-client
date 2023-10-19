import {device, element, by, expect} from 'detox';
import app from './helpers/mockServer';
import demoCategories from './helpers/demoCategories.json';
import {Server} from 'http';
import {Category} from '../../components/CategoryItem';

let server: Server;
describe('CategoryList screen', () => {
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

  it('should load categories', async () => {
    const toCategoriesBtn = element(by.id('Categories-btn'));
    await expect(toCategoriesBtn).toBeVisible();
    await toCategoriesBtn.tap();
    await expect(element(by.id('main-heading'))).toBeVisible();

    const categoriesData = demoCategories.categories as Category[];
    const flatlist = by.id('flat-list');

    for (let i = 0; i < categoriesData.length; i++) {
      const titleEl = element(by.id('category-title-' + categoriesData[i]._id));

      await waitFor(titleEl)
        .toBeVisible()
        .whileElement(flatlist)
        .scroll(50, 'down');
    }

    await expect(element(by.id('end-of-data-text'))).toBeVisible;
  });
});
