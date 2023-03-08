import type {Category} from '../components/CategoryItem';
import demoCategories from './demoCategories.json';

const fetchCategories = (
  page: number,
  arrOfIds?: string[],
): Promise<Category[]> => {
  return new Promise((resolve, reject) => {
    let data: Category[] = [];
    const error: boolean = false;

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

    if (arrOfIds) {
      data = [];

      data = demoCategories.categories.filter(category =>
        arrOfIds.includes(category._id),
      );
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

const fetchSingleCategory = (id: string): Promise<Category | undefined> => {
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

    resolve(
      demoCategories.categories.find(item => item._id === id) as Category,
    );
  });
};

export default {fetchCategories, fetchSingleCategory};
