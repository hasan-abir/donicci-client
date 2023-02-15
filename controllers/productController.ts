import type {Product} from '../components/ProductItem';
import demoProducts from './demoProducts.json';

const fetchProducts = (
  page: number,
  categoryId?: string,
): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    let data: Product[] = [];

    switch (page) {
      case 1:
        data = demoProducts.products.slice(0, 5) as Product[];
        break;
      case 2:
        data = demoProducts.products.slice(
          5,
          demoProducts.products.length,
        ) as Product[];
        break;
      default:
        data = [];
    }

    setTimeout(() => {
      resolve(data);
    }, 3000);
  });
};

const fetchSingleProduct = (id: string): Promise<Product | undefined> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(demoProducts.products.find(item => item._id === id) as Product);
    }, 3000);
  });
};

export default {fetchProducts, fetchSingleProduct};
