import type {Review} from '../components/UserReview';
import demoReviews from './demoReviews.json';

const fetchReviews = (page: number, productId: string): Promise<Review[]> => {
  return new Promise((resolve, reject) => {
    let data: Review[] = [];
    const error: boolean = false;

    switch (page) {
      case 1:
        data = (demoReviews.reviews as Review[]).filter(
          review => review.product_id === productId,
        );
        data = data.slice(0, 5);
        break;
      case 2:
        data = (demoReviews.reviews as Review[]).filter(
          review => review.product_id === productId,
        );
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

    resolve(data);
  });
};

const postReview = (description: string, token: string): Promise<void> => {
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

    resolve();
  });
};

export default {fetchReviews, postReview};
