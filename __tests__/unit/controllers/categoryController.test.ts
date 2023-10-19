/**
 * @format
 */
import 'react-native';

import axiosInstance from '../../../axios/instance';
import categoryController from '../../../controllers/categoryController';

jest.mock('../../../axios/instance');

describe('CategoryController', () => {
  describe('fetchCategories', () => {
    it('fetches correctly with params', async () => {
      const next = '17-10-23';

      const response = {
        data: ['category-1', 'category-2'],
      };

      (axiosInstance.get as jest.Mock).mockResolvedValue(response);

      const apiResponse = await categoryController.fetchCategories(next);

      expect(apiResponse[0]).toBe(response.data[0]);
      expect(apiResponse[1]).toBe(response.data[1]);
      expect(axiosInstance.get).toHaveBeenCalledWith('/categories', {
        params: {next},
      });
    });
    it('fetches correctly without params', async () => {
      const response = {
        data: ['category-1', 'category-2'],
      };

      (axiosInstance.get as jest.Mock).mockResolvedValue(response);

      const apiResponse = await categoryController.fetchCategories();

      expect(apiResponse[0]).toBe(response.data[0]);
      expect(apiResponse[1]).toBe(response.data[1]);
      expect(axiosInstance.get).toHaveBeenCalledWith('/categories', {
        params: {
          next: undefined,
        },
      });
    });
  });
  describe('fetchSingleCategory', () => {
    it('fetches correctly with id', async () => {
      const id = '123';

      const response = {
        data: {_id: '123', name: 'Category'},
      };

      (axiosInstance.get as jest.Mock).mockResolvedValue(response);

      const apiResponse = await categoryController.fetchSingleCategory(id);

      expect(apiResponse.name).toBe(response.data.name);
      expect(axiosInstance.get).toHaveBeenCalledWith('/categories/' + id);
    });
  });
});
