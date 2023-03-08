import type {Product} from '../components/ProductItem';
import demoProducts from './demoProducts.json';

const fetchProducts = (
  page: number,
  categoryId?: string,
  term?: string,
): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    let data: Product[] = [];
    const error: boolean = false;

    const termFilter = demoProducts.products.filter(product => {
      const title = product.title.toLowerCase();
      return term && title.includes(term.toLowerCase());
    });

    const categoryFilter = demoProducts.products.filter(product => {
      return (
        categoryId &&
        product.category_ids &&
        product.category_ids.includes(categoryId)
      );
    });

    switch (page) {
      case 1:
        data = demoProducts.products;
        if (term) {
          data = termFilter;
        }
        if (categoryId) {
          data = categoryFilter;
        }
        data = data.slice(0, 5);
        break;
      case 2:
        data = demoProducts.products;
        if (term) {
          data = termFilter;
        }
        if (categoryId) {
          data = categoryFilter;
        }
        data = data.slice(5, data.length);
        break;
      default:
        data = [];
    }

    if (error) {
      const errObj: any = new Error();
      errObj.response = {
        status: 500,
        data: {msg: "Sommin'"},
      };

      reject(errObj);
    }

    setTimeout(() => {
      resolve(data);
    }, 3000);
  });
};

const fetchSingleProduct = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve, reject) => {
    const error: boolean = false;

    if (error) {
      const errObj: any = new Error();
      errObj.response = {
        status: 500,
        data: {msg: "Sommin'"},
      };

      reject(errObj);
    }

    setTimeout(() => {
      resolve(demoProducts.products.find(item => item._id === id) as Product);
    }, 3000);
  });
};

export default {fetchProducts, fetchSingleProduct};
