import React, {Dispatch, SetStateAction, useState} from 'react';
import type {Product} from '../components/ProductItem';
import userController, {
  LoginInput,
  RegisterInput,
  User,
} from '../controllers/userController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {ImageType} from '../components/ProductItem';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import cartItemController from '../controllers/cartItemController';

interface CartSum {
  subTotal: number;
  tax: number;
  total: number;
}

interface GlobalError {
  msgs: string[];
  name: string;
}

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    images: ImageType[];
    price: number;
    quantity: number;
  };
  selectedQuantity: number;
  updated_at?: string;
  created_at?: string;
}

interface Value {
  user: User | null;
  token: string | null;
  authenticating: boolean;
  authenticateUser: (
    input: RegisterInput | LoginInput,
    screen: string,
  ) => Promise<boolean>;
  verifyCurrentUser: () => Promise<void>;
  logOutUser: () => Promise<void>;
  error: GlobalError | null;
  handleError: (errObj: any, screen: string) => void;
  clearError: () => void;
  cartItems: CartItem[];
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
  addItemToCart: (
    product: Product,
    selectedQuantity: number,
    screen: string,
  ) => Promise<void>;
  removeItemFromCart: (productId: string, screen: string) => Promise<void>;
  calculateTheTotals: (items: CartItem[]) => void;
  inCart: (productId: string) => boolean;
  cartSum: CartSum;
  updateSelectedQuantity: (productId: string, add: boolean) => void;
  clearCart: () => void;
}

export const RootContext = React.createContext<Value>({
  user: null,
  token: null,
  authenticating: false,
  authenticateUser: () =>
    new Promise((resolve, reject) => {
      resolve(false);
    }),
  verifyCurrentUser: () =>
    new Promise((resolve, reject) => {
      resolve();
    }),
  logOutUser: () =>
    new Promise((resolve, reject) => {
      resolve();
    }),
  error: null,
  handleError: () => {},
  clearError: () => {},
  cartItems: [],
  setCartItems: () => {},
  cartSum: {
    subTotal: 0,
    tax: 0,
    total: 0,
  },
  addItemToCart: () =>
    new Promise((resolve, reject) => {
      resolve();
    }),
  removeItemFromCart: () =>
    new Promise((resolve, reject) => {
      resolve();
    }),
  calculateTheTotals: () => {},
  inCart: () => false,
  updateSelectedQuantity: () => {},
  clearCart: () => {},
});

type Props = {
  children: JSX.Element;
};

const RootContextProvider = ({children}: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [error, setError] = useState<GlobalError | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSum, setCartSum] = useState<CartSum>({
    subTotal: 0,
    tax: 0,
    total: 0,
  });

  const authenticateUser = async (
    input: RegisterInput | LoginInput,
    screen: string,
  ) => {
    try {
      clearError();

      let userToken = null;

      if (screen === 'Register') {
        userToken = await userController.register(input as RegisterInput);
      } else if (screen === 'Login') {
        userToken = await userController.login(input as LoginInput);
      }

      if (userToken) {
        const currentUser = await userController.getCurrentUser(userToken);

        setUser(currentUser);
        setToken(userToken);

        await AsyncStorage.setItem('@user_token', userToken);
      }

      return true;
    } catch (error: any) {
      handleError(error, screen);
      return false;
    }
  };

  const verifyCurrentUser = async () => {
    try {
      setAuthenticating(true);

      const storedToken = await AsyncStorage.getItem('@user_token');

      if (storedToken !== null) {
        const currentUser = await userController.getCurrentUser(storedToken);

        setUser(currentUser);
        setToken(storedToken);
      }
    } catch (error: any) {
      handleError(error, 'Home');
    } finally {
      setAuthenticating(false);
    }
  };

  const logOutUser = async () => {
    try {
      setAuthenticating(true);

      await AsyncStorage.removeItem('@user_token');
      setUser(null);
      setToken(null);
    } catch (error: any) {
      handleError(error, 'Home');
    } finally {
      setAuthenticating(false);
    }
  };

  const handleError = (errObj: any, screen: string) => {
    const status = errObj.response.status;
    const data = errObj.response.data || {};
    let msgs: string[] = [];

    if (data.msg) {
      msgs = [data.msg];
    }

    if (data.msgs) {
      msgs = data.msgs;
    }

    if (status === 500) {
      msgs = ['Something went wrong, try refreshing'];
    }

    setError({msgs, name: screen});
  };

  const clearError = () => {
    setError(null);
  };

  const calculateTheTotals = (items: CartItem[]) => {
    const subTotal = Math.round(
      items
        .map(item => {
          return item.product.price * item.selectedQuantity;
        })
        .reduce((a, b) => a + b, 0),
    );
    const tax = Math.round(subTotal * 0.05);

    setCartSum({
      subTotal,
      tax,
      total: Math.round(subTotal + tax),
    });
  };

  const addItemToCart = async (
    product: Product,
    selectedQuantity: number,
    screen: string,
  ) => {
    try {
      let cartItem = null;

      if (user && token) {
        cartItem = await cartItemController.addCartItem(
          token,
          product._id,
          selectedQuantity,
        );
      } else {
        cartItem = {
          _id: uuidv4(),
          product: {
            _id: product._id,
            title: product.title,
            images: product.images,
            quantity: product.quantity as number,
            price: product.price,
          },
          selectedQuantity,
        };
      }

      const updatedCartItems = [...cartItems, cartItem as CartItem];
      setCartItems(updatedCartItems);

      calculateTheTotals(updatedCartItems);
    } catch (error: any) {
      handleError(error, screen);
    }
  };

  const removeItemFromCart = async (productId: string, screen: string) => {
    try {
      const cartItem = cartItems.find(item => item.product._id === productId);

      if (!cartItem) return;

      if (user && token) {
        await cartItemController.removeCartItem(token, cartItem._id);
      }

      const updatedCartItems = cartItems.filter(
        item => item._id !== cartItem._id,
      );

      setCartItems(updatedCartItems);

      calculateTheTotals(updatedCartItems);
    } catch (error) {
      handleError(error, screen);
    }
  };

  const updateSelectedQuantity = (productId: string, add: boolean) => {
    const updatedCartItems = cartItems.map(item => {
      if (item._id === productId && item.product.quantity) {
        if (add && item.selectedQuantity < item.product.quantity) {
          item.selectedQuantity++;
        }

        if (!add && item.selectedQuantity > 1) {
          item.selectedQuantity--;
        }
      }

      return item;
    });

    setCartItems(updatedCartItems);
    calculateTheTotals(updatedCartItems);
  };

  const clearCart = () => {
    setCartItems([]);
    setCartSum({subTotal: 0, tax: 0, total: 0});
  };

  const inCart = (productId: string) => {
    return cartItems.map(item => item.product._id).includes(productId);
  };
  return (
    <RootContext.Provider
      value={{
        user,
        token,
        authenticating,
        authenticateUser,
        verifyCurrentUser,
        logOutUser,
        error,
        handleError,
        clearError,
        cartItems,
        setCartItems,
        cartSum,
        addItemToCart,
        removeItemFromCart,
        calculateTheTotals,
        inCart,
        updateSelectedQuantity,
        clearCart,
      }}>
      {children}
    </RootContext.Provider>
  );
};

export default RootContextProvider;
