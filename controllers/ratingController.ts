import type {Rating} from '../components/StarRating';
import demoRatings from './demoRatings.json';

const fetchRatings = (productId: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const error: boolean = false;

    const ratingsOnProduct = (demoRatings.ratings as Rating[]).filter(
      rating => rating.product_id === productId,
    );

    const totalRatings = ratingsOnProduct
      .map(rating => rating.score)
      .reduce((prevScore, currentScore) => prevScore + currentScore, 0);

    const averageRating =
      Math.round((totalRatings / ratingsOnProduct.length) * 10) / 10;

    if (error) {
      const errObj: any = new Error();
      errObj.response = {
        status: 500,
        data: {msg: "Sommin'"},
      };

      reject(errObj);
    }

    resolve(averageRating);
  });
};

const addRating = (productId: string, score: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const error: boolean = false;

    const ratingsOnProduct = (demoRatings.ratings as Rating[]).filter(
      rating => rating.product_id === productId,
    );

    const totalRatings = [
      ...ratingsOnProduct.map(rating => rating.score),
      score,
    ].reduce((prevScore, currentScore) => prevScore + currentScore, 0);

    const averageRating =
      Math.round((totalRatings / (ratingsOnProduct.length + 1)) * 10) / 10;

    if (error) {
      const errObj: any = new Error();
      errObj.response = {
        status: 500,
        data: {msg: "Sommin'"},
      };

      reject(errObj);
    }

    resolve(averageRating);
  });
};

export default {fetchRatings, addRating};
