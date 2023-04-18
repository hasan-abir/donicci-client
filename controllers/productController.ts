import type {Product} from '../components/ProductItem';
import demoProducts from './demoProducts.json';

const fetchProducts = (
  page: number,
  categoryId?: string,
  term?: string,
): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    let data: Product[] = [];
    const originalData = demoProducts.products;
    let error: boolean = false;

    const termFilter = originalData.filter(product => {
      const title = product.title.toLowerCase();
      return term && title.includes(term.toLowerCase());
    });

    const categoryFilter = originalData.filter(product => {
      return categoryId && product.category_ids.includes(categoryId);
    });

    switch (page) {
      case 1:
        data = [...originalData];
        if (term) {
          data = [...termFilter];
        }
        if (categoryId) {
          data = [...categoryFilter];
        }
        data = data.slice(0, 5);
        break;
      case 2:
        data = [...originalData];
        if (term) {
          data = [...termFilter];
        }
        if (categoryId) {
          data = [...categoryFilter];
        }
        data = data.slice(5, data.length);
        break;
      default:
        data = [];
    }

    // if (Math.floor(Math.random() * 5) === 1) {
    //   error = true;
    // }

    if (error) {
      const errObj: any = new Error();
      errObj.response = {
        status: 500,
        data: {msg: "Sommin'"},
      };

      reject(errObj);
    }

    resolve(data);
  });
};

const fetchSingleProduct = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve, reject) => {
    let error: boolean = false;
    let data: Product | undefined = undefined;

    data = demoProducts.products.find(item => item._id === id) as Product;

    // if (Math.floor(Math.random() * 3) === 1) {
    //   error = true;
    // }

    if (error) {
      const errObj: any = new Error();
      errObj.response = {
        status: 500,
        data: {msg: "Sommin'"},
      };

      reject(errObj);
    }

    resolve(data);
  });
};

export default {fetchProducts, fetchSingleProduct};
