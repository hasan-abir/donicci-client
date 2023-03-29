import React, {useState} from 'react';
import type {Product} from '../components/ProductItem';

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
  const [error, setError] = useState<GlobalError | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSum, setCartSum] = useState<CartSum>({
    subTotal: 0,
    tax: 0,
    total: 0,
  });

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
