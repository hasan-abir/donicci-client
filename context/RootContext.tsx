import React, {useState} from 'react';
import type {Product} from '../components/ProductItem';
import userController, {
  LoginInput,
  RegisterInput,
  User,
} from '../controllers/userController';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartSum {
  subTotal: number;
  tax: number;
  total: number;
}

interface GlobalError {
  msg: string;
  name: string;
}

export interface CartItem extends Product {
  selectedQuantity: number;
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
  addItemToCart: (cartItem: CartItem) => void;
  removeItemFromCart: (id: string) => void;
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
  cartSum: {
    subTotal: 0,
    tax: 0,
    total: 0,
  },
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  inCart: () => false,
  updateSelectedQuantity: () => {},
  clearCart: () => {},
});

type Props = {
  children: JSX.Element;
};

const RootContextProvider = ({children}: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>('123');
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
    const data = errObj.response.data;

    setError({msg: data.msg, name: screen});

    if (status === 500) {
      setError({msg: 'Something went wrong, try refreshing', name: screen});
    }
  };

  const clearError = () => {
    setError(null);
  };

  const calculateTheTotals = (items: CartItem[]) => {
    const subTotal = Math.round(
      items
        .map(item => {
          return item.price * item.selectedQuantity;
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

  const addItemToCart = (cartItem: CartItem) => {
    const updatedCartItems = [...cartItems, cartItem];
    setCartItems(updatedCartItems);

    calculateTheTotals(updatedCartItems);
  };

  const removeItemFromCart = (id: string) => {
    const updatedCartItems = cartItems.filter(item => item._id !== id);

    setCartItems(updatedCartItems);

    calculateTheTotals(updatedCartItems);
  };

  const updateSelectedQuantity = (productId: string, add: boolean) => {
    const updatedCartItems = cartItems.map(item => {
      if (item._id === productId && item.quantity) {
        if (add && item.selectedQuantity < item.quantity) {
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
    return cartItems.map(item => item._id).includes(productId);
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
        cartSum,
        addItemToCart,
        removeItemFromCart,
        inCart,
        updateSelectedQuantity,
        clearCart,
      }}>
      {children}
    </RootContext.Provider>
  );
};

export default RootContextProvider;
