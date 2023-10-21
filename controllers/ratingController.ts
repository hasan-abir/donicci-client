import axiosInstance from '../axios/instance';
import {getTokens} from '../context/RootContext';

const addRating = async (productId: string, score: number): Promise<number> => {
  const {access} = await getTokens();

  const res = await axiosInstance.post<{average_score: number}>(
    '/ratings',
    {product_id: productId, score},
    {headers: {Authorization: 'Bearer ' + access}},
  );

  return res.data.average_score;
};

export default {addRating};
