import type {Product} from '../components/ProductItem';
import demoProducts from './demoProducts.json';
import axiosInstance from '../axios/instance';

const fetchProducts = async (
  next?: string,
  categoryId?: string,
  term?: string,
): Promise<Product[]> => {
  const res = await axiosInstance.get<Product[]>('/products', {
    params: {next, category_id: categoryId, search_term: term},
  });

  return res.data;
};

const fetchSingleProduct = (id: string) => {
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
