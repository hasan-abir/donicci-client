/**
 * @format
 */
import 'react-native';

import axiosInstance from '../../../axios/instance';
import reviewController from '../../../controllers/reviewController';

jest.mock('../../../axios/instance');

describe('ReviewController', () => {
  describe('fetchReviews', () => {
    it('fetches correctly with params', async () => {
      const next = '17-10-23';
      const productId = '123';

      const response = {
        data: ['review-1', 'review-2'],
      };

      (axiosInstance.get as jest.Mock).mockResolvedValue(response);

      const apiResponse = await reviewController.fetchReviews(productId, next);

      expect(apiResponse[0]).toBe(response.data[0]);
      expect(apiResponse[1]).toBe(response.data[1]);
      expect(axiosInstance.get).toHaveBeenCalledWith(
        '/reviews/product/' + productId,
        {
          params: {next},
        },
      );
    });

    it('fetches correctly without params', async () => {
      const productId = '123';

      const response = {
        data: ['review-1', 'review-2'],
      };

      (axiosInstance.get as jest.Mock).mockResolvedValue(response);

      const apiResponse = await reviewController.fetchReviews(productId);

      expect(apiResponse[0]).toBe(response.data[0]);
      expect(apiResponse[1]).toBe(response.data[1]);
      expect(axiosInstance.get).toHaveBeenCalledWith(
        '/reviews/product/' + productId,
        {
          params: {next: undefined},
        },
      );
    });
  });
  describe('postReview', () => {
    it('posts review correctly', async () => {
      const body = {
        description: 'Lorem',
        product_id: '123',
        token: '456',
      };

      const response = {
        data: {
          description: body.description,
        },
      };

      (axiosInstance.post as jest.Mock).mockResolvedValue(response);

      const apiResponse = await reviewController.postReview(
        body.description,
        body.product_id,
        body.token,
      );

      expect(apiResponse.description).toBe(response.data.description);
      expect(axiosInstance.post).toHaveBeenCalledWith(
        '/reviews',
        {
          description: body.description,
          product_id: body.product_id,
        },
        {headers: {Authorization: 'Bearer ' + body.token}},
      );
    });
  });
});
