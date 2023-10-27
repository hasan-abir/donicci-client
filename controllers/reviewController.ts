import axiosInstance from '../axios/instance';
import type {Review} from '../components/UserReview';

const fetchReviews = async (
  productId: string,
  next?: string,
): Promise<Review[]> => {
  const res = await axiosInstance.get<Review[]>(
    '/reviews/product/' + productId,
    {params: {next}},
  );

  return res.data;
};

const postReview = async (
  description: string,
  productId: string,
  token: string,
): Promise<Review> => {
  const res = await axiosInstance.post<Review>(
    '/reviews',
    {description, product_id: productId},
    {headers: {Authorization: 'Bearer ' + token}},
  );

  return res.data;
};

export default {fetchReviews, postReview};
