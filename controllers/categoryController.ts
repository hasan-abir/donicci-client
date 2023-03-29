import type {Category} from '../components/CategoryItem';
import demoCategories from './demoCategories.json';

const fetchCategories = (
  page: number,
  arrOfIds?: string[],
): Promise<Category[]> => {
  return new Promise((resolve, reject) => {
    let data: Category[] = [];
    const originalData = [...demoCategories.categories];
    const error: boolean = false;

    switch (page) {
      case 1:
        data = [...originalData];
        break;
      default:
        data = [];
    }

    if (arrOfIds) {
      data = [];

      data = originalData.filter(category => arrOfIds.includes(category._id));
    }

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
