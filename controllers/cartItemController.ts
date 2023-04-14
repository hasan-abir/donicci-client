import type {CartItem} from '../context/RootContext';
import demoCartItems from './demoCartItems.json';
import demoProducts from './demoProducts.json';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

const fetchCartItems = (token: string): Promise<CartItem[]> => {
  return new Promise((resolve, reject) => {
    let data: CartItem[] = [];

    const error: boolean = false;

    data = demoCartItems.cartItems
      .filter(item => item.user_id === '1')
      .map(item => {
        const product = demoProducts.products.find(
          product => product._id === item.product_id,
        );

        if (product) {
          return {
            _id: item._id,
            product: {
              _id: product?._id,
              title: product?.title,
              images: product?.images,
              price: product?.price,
              quantity: product?.quantity,
            },
            selectedQuantity: item.selected_quantity,
            updated_at: item.updated_at,
            created_at: item.created_at,
          };
        }
      }) as CartItem[];

    if (error) {
      const errObj: any = new Error();
      errObj.response = {
        status: 500,
        data: {msg: "Sommin'"},
      };

      reject(errObj);
    }

    resolve(data);
  });
};

const addCartItem = (
  token: string,
  productId: string,
  selectedQuantity: number,
): Promise<CartItem> => {
  return new Promise((resolve, reject) => {
    let data: CartItem | null = null;
    const error: boolean = false;

    const product = demoProducts.products.find(
      product => product._id === productId,
    );

    if (product) {
      data = {
        _id: uuidv4(),
        product: {
          _id: product._id,
          title: product.title,
          images: product.images,
          price: product.price,
          quantity: product.quantity,
        },
        selectedQuantity: selectedQuantity,
        updated_at: '2023-03-04T06:27:45.282+00:00',
        created_at: '2023-03-05T06:27:45.282+00:00',
      };
    }

    if (error) {
      const errObj: any = new Error();
      errObj.response = {
        status: 500,
        data: {msg: "Sommin'"},
      };

      reject(errObj);
    }

    resolve(data as CartItem);
  });
};

const removeCartItem = (token: string, id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const error: boolean = false;

    if (error) {
      const errObj: any = new Error();
      errObj.response = {
        status: 500,
        data: {msg: "Sommin'"},
      };

      reject(errObj);
    }

    resolve();
  });
};

export default {
  fetchCartItems,
  addCartItem,
  removeCartItem,
};
