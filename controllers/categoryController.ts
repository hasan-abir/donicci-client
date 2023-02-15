import type {Category} from '../components/CategoryItem';
import demoCategories from './demoCategories.json';

const fetchCategories = (page: number): Promise<Category[]> => {
  return new Promise((resolve, reject) => {
    let data: Category[] = [];

    switch (page) {
      case 1:
        data = demoCategories.categories.slice(0, 5) as Category[];
        break;
      case 2:
        data = demoCategories.categories.slice(
          5,
          demoCategories.categories.length,
        ) as Category[];
        break;
      default:
        data = [];
    }

    setTimeout(() => {
      resolve(data);
    }, 3000);
  });
};

const fetchSingleCategory = (id: string): Promise<Category | undefined> => {
  return new Promise(resolve => {
    resolve(
      demoCategories.categories.find(item => item._id === id) as Category,
    );
  });
};

export default {fetchCategories, fetchSingleCategory};
