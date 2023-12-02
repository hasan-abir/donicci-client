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

export enum ErrorType {
  Auth,
  Fetch,
  Form,
}

interface GlobalError {
  msgs: string[];
  name: string;
  type: ErrorType;
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

interface Tokens {
  access: string | null;
  refresh: string | null;
}

interface Value {
  user: User | null;
  authenticating: boolean;
  authenticateUser: (
    input: RegisterInput | LoginInput,
    screen: string,
  ) => Promise<boolean>;
  attemptRefreshToken: () => Promise<string>;
  verifyCurrentUser: () => Promise<void>;
  logOutUser: () => Promise<void>;
  error: GlobalError | null;
  handleError: (errObj: any, screen: string, type: ErrorType) => void;
  clearError: (type: ErrorType) => void;
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
  authenticating: false,
  authenticateUser: () =>
    new Promise((resolve, reject) => {
      resolve(false);
    }),
  attemptRefreshToken: () =>
    new Promise((resolve, reject) => {
      resolve('');
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

export const getTokens = async (): Promise<Tokens> => {
  const access = await AsyncStorage.getItem('@user_token');
  const refresh = await AsyncStorage.getItem('@refresh_token');

  return {access, refresh};
};

type Props = {
  children: JSX.Element;
};

const RootContextProvider = ({children}: Props) => {
  const [user, setUser] = useState<User | null>(null);
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
      clearError(ErrorType.Form);

      let authResponse = null;

      if (screen === 'Register') {
        authResponse = await userController.register(input as RegisterInput);
      } else {
        authResponse = await userController.login(input as LoginInput);
      }

      if (authResponse) {
        await AsyncStorage.setItem('@user_token', authResponse.access_token);
        await AsyncStorage.setItem(
          '@refresh_token',
          authResponse.refresh_token,
        );

        await verifyCurrentUser();

        clearError(ErrorType.Auth);
      }

      return true;
    } catch (err: any) {
      handleError(err, screen, ErrorType.Form);
      return false;
    }
  };

  const attemptRefreshToken = async () => {
    const tokens = await getTokens();

    const authResponse = await userController.refreshToken(tokens.refresh);

    await AsyncStorage.setItem('@user_token', authResponse.access_token);
    await AsyncStorage.setItem('@refresh_token', authResponse.refresh_token);

    return authResponse.access_token;
  };

  const verifyCurrentUser = async () => {
    const tokens = await getTokens();

    if (!user && tokens.access && tokens.refresh) {
      try {
        setAuthenticating(true);

        const currentUser = await userController.getCurrentUser(tokens.access);

        setUser(currentUser);
      } catch (err: any) {
        handleError(err, 'Products', ErrorType.Auth);
      }

      setAuthenticating(false);
    }
  };

  const logOutUser = async () => {
    try {
      setAuthenticating(true);
      const tokens = await getTokens();

      await userController.logout(tokens.access);
    } catch (err: any) {
      handleError(err, 'Products', ErrorType.Auth);
    } finally {
      await AsyncStorage.removeItem('@user_token');
      await AsyncStorage.removeItem('@refresh_token');
      setUser(null);
      setAuthenticating(false);
    }
  };

  const handleError = (errObj: any, screen: string, type: ErrorType) => {
    let status = 500;
    let data: {msg?: string; msgs?: string[]} = {};

    if (errObj.response) {
      status = errObj.response.status;
      data = errObj.response.data;
    }

    let msgs: string[] = [];

    if (data) {
      if (data.msg) {
        msgs = [data.msg];
      }

      if (data.msgs) {
        msgs = data.msgs;
      }
    }

    if (status === 500) {
      msgs = ['Something went wrong, try refreshing'];
    }

    setError({msgs, name: screen, type});
  };

  const clearError = (type: ErrorType) => {
    if (error && type === error.type) {
      setError(null);
    }
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
      const tokens = await getTokens();
      let cartItem = null;
      if (user && tokens.access) {
        cartItem = await cartItemController.addCartItem(
          tokens.access,
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
    } catch (err: any) {
      handleError(err, screen, ErrorType.Form);
    }
  };

  const removeItemFromCart = async (productId: string, screen: string) => {
    try {
      const cartItem = cartItems.find(item => item.product._id === productId);
      if (!cartItem) return;

      const tokens = await getTokens();

      if (user && tokens.access) {
        await cartItemController.removeCartItem(tokens.access, cartItem._id);
      }
      const updatedCartItems = cartItems.filter(
        item => item._id !== cartItem._id,
      );
      setCartItems(updatedCartItems);
      calculateTheTotals(updatedCartItems);
    } catch (err) {
      handleError(err, screen, ErrorType.Form);
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
        authenticating,
        authenticateUser,
        attemptRefreshToken,
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
