import 'react-native-get-random-values';
import axiosInstance from '../axios/instance';
import type {CartItem} from '../context/RootContext';

const fetchCartItems = async (token: string): Promise<CartItem[]> => {
  const res = await axiosInstance.get('/cart', {
    headers: {Authorization: 'Bearer ' + token},
  });

  return res.data;
};

const addCartItem = async (
  token: string,
  productId: string,
  selectedQuantity: number,
): Promise<CartItem> => {
  const res = await axiosInstance.post(
    '/cart',
    {item: {product_id: productId, selected_quantity: selectedQuantity}},
    {headers: {Authorization: 'Bearer ' + token}},
  );

  return res.data;
};

const removeCartItem = async (token: string, id: string): Promise<void> => {
  await axiosInstance.delete('/cart/' + id, {
    headers: {Authorization: 'Bearer ' + token},
  });
};

const removeAllCartItems = async (token: string): Promise<void> => {
  await axiosInstance.delete('/cart/all', {
    headers: {Authorization: 'Bearer ' + token},
  });
};

const isInCart = async (token: string, productId: string): Promise<void> => {
  await axiosInstance.get('/cart/is-in-cart/' + productId, {
    headers: {Authorization: 'Bearer ' + token},
  });
};

export default {
  fetchCartItems,
  addCartItem,
  removeCartItem,
  removeAllCartItems,
  isInCart,
};
