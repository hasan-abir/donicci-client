/**
 * @format
 */
import 'react-native';

import axiosInstance from '../../../axios/instance';
import productController from '../../../controllers/productController';

jest.mock('../../../axios/instance');

describe('ProductController', () => {
  describe('fetchProducts', () => {
    it('fetches correctly with params', async () => {
      const next = '17-10-23';
      const categoryId = '123';
      const searchTerm = "Somethin'";

      const response = {
        data: ['product-1', 'product-2'],
      };

      (axiosInstance.get as jest.Mock).mockResolvedValue(response);

      const apiResponse = await productController.fetchProducts(
        next,
        categoryId,
        searchTerm,
      );

      expect(apiResponse[0]).toBe(response.data[0]);
      expect(apiResponse[1]).toBe(response.data[1]);
      expect(axiosInstance.get).toHaveBeenCalledWith('/products', {
        params: {next, category_id: categoryId, search_term: searchTerm},
      });
    });
    it('fetches correctly without params', async () => {
      const response = {
        data: ['product-1', 'product-2'],
      };

      (axiosInstance.get as jest.Mock).mockResolvedValue(response);

      const apiResponse = await productController.fetchProducts();

      expect(apiResponse[0]).toBe(response.data[0]);
      expect(apiResponse[1]).toBe(response.data[1]);
      expect(axiosInstance.get).toHaveBeenCalledWith('/products', {
        params: {
          next: undefined,
          category_id: undefined,
          search_term: undefined,
        },
      });
    });
  });

  describe('fetchSingleProduct', () => {
    it('fetches correctly with id', async () => {
      const id = '123';

      const response = {
        data: {_id: '123', title: 'Product'},
      };

      (axiosInstance.get as jest.Mock).mockResolvedValue(response);

      const apiResponse = await productController.fetchSingleProduct(id);

      expect(apiResponse._id).toBe(response.data._id);
      expect(apiResponse.title).toBe(response.data.title);
      expect(axiosInstance.get).toHaveBeenCalledWith('/products/' + id);
    });
  });
});
