import axiosInstance from '../axios/instance';

const addRating = async (
  productId: string,
  score: number,
  token: string,
): Promise<number> => {
  const res = await axiosInstance.post<{average_score: number}>(
    '/ratings',
    {product_id: productId, score},
    {headers: {Authorization: 'Bearer ' + token}},
  );

  return res.data.average_score;
};

export default {addRating};
