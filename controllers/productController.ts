import type {Product} from '../components/ProductItem';
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

const fetchSingleProduct = async (id: string): Promise<Product> => {
  const res = await axiosInstance.get<Product>('/products/' + id);

  return res.data;
};

export default {fetchProducts, fetchSingleProduct};
