import type {Category} from '../components/CategoryItem';
import axiosInstance from '../axios/instance';

const fetchCategories = async (next?: string): Promise<Category[]> => {
  const res = await axiosInstance.get<Category[]>('/categories', {
    params: {next},
  });

  return res.data;
};

const fetchSingleCategory = async (id: string): Promise<Category> => {
  const res = await axiosInstance.get<Category>('/categories/' + id);

  return res.data;
};

export default {fetchCategories, fetchSingleCategory};
