/**
 * @format
 */
import 'react-native';

import axiosInstance from '../../../axios/instance';
import ratingController from '../../../controllers/ratingController';

jest.mock('../../../axios/instance');

describe('RatingController', () => {
  describe('addRating', () => {
    it('posts rating correctly', async () => {
      const productId = '123';
      const token = '234';
      const score = 3;

      const response = {
        data: {average_score: 4},
      };

      (axiosInstance.post as jest.Mock).mockResolvedValue(response);

      const apiResponse = await ratingController.addRating(
        productId,
        score,
        token,
      );

      expect(apiResponse).toBe(response.data.average_score);
      expect(axiosInstance.post).toHaveBeenCalledWith(
        '/ratings',
        {product_id: productId, score},
        {headers: {Authorization: 'Bearer ' + token}},
      );
    });
  });
});
