/**
 * @format
 */
import 'react-native';

import axiosInstance from '../../../axios/instance';
import cartItemController from '../../../controllers/cartItemController';

jest.mock('../../../axios/instance');

describe('CartItemController', () => {
  describe('fetchCartItems', () => {
    it('fetches correctly', async () => {
      const token = "123'";

      const response = {
        data: ['cartItem-1', 'cartItem-2'],
      };

      (axiosInstance.get as jest.Mock).mockResolvedValue(response);

      const apiResponse = await cartItemController.fetchCartItems(token);

      expect(apiResponse[0]).toBe(response.data[0]);
      expect(apiResponse[1]).toBe(response.data[1]);
      expect(axiosInstance.get).toHaveBeenCalledWith('/cart', {
        headers: {Authorization: 'Bearer ' + token},
      });
    });
  });
  describe('addCartItem', () => {
    it('posts cart item correctly', async () => {
      const token = "123'";
      const productId = '234';
      const selectedQuantity = 3;

      const response = {
        data: {_id: '1'},
      };

      (axiosInstance.post as jest.Mock).mockResolvedValue(response);

      const apiResponse = await cartItemController.addCartItem(
        token,
        productId,
        selectedQuantity,
      );

      expect(apiResponse).toBe(response.data);
      expect(axiosInstance.post).toHaveBeenCalledWith(
        '/cart',
        {item: {product_id: productId, selected_quantity: selectedQuantity}},
        {headers: {Authorization: 'Bearer ' + token}},
      );
    });
  });
  describe('removeCartItem', () => {
    it('removes cart item correctly', async () => {
      const token = "123'";
      const id = '234';

      (axiosInstance.delete as jest.Mock).mockResolvedValue(null);

      await cartItemController.removeCartItem(token, id);

      expect(axiosInstance.delete).toHaveBeenCalledWith('/cart/' + id, {
        headers: {Authorization: 'Bearer ' + token},
      });
    });
  });

  describe('removeAllCartItems', () => {
    it('removes cart item correctly', async () => {
      const token = "123'";

      (axiosInstance.delete as jest.Mock).mockResolvedValue(null);

      await cartItemController.removeAllCartItems(token);

      expect(axiosInstance.delete).toHaveBeenCalledWith('/cart/all', {
        headers: {Authorization: 'Bearer ' + token},
      });
    });
  });
  describe('isInCart', () => {
    it('removes cart item correctly', async () => {
      const token = "123'";
      const productId = '234';

      (axiosInstance.get as jest.Mock).mockResolvedValue(null);

      await cartItemController.isInCart(token, productId);

      expect(axiosInstance.get).toHaveBeenCalledWith(
        '/cart/is-in-cart/' + productId,
        {
          headers: {Authorization: 'Bearer ' + token},
        },
      );
    });
  });
});
