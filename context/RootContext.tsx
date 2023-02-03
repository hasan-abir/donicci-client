import React, {useState} from 'react';
import type {Product} from '../components/ProductItem';

type CartSum = {
  subTotal: number;
  tax: number;
  total: number;
};

export type CartItem = Product & {
  selectedQuantity: number;
};

type Value = {
  cartItems: CartItem[];
  addItemToCart: (cartItem: CartItem) => void;
  removeItemFromCart: (id: string) => void;
  inCart: (productId: string) => boolean;
  cartSum: CartSum;
  updateSelectedQuantity: (productId: string, add: boolean) => void;
  clearCart: () => void;
};

export const RootContext = React.createContext<Value>({
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSum, setCartSum] = useState<CartSum>({
    subTotal: 0,
    tax: 0,
    total: 0,
  });

  const calculateTheTotals = (items: CartItem[]) => {
    const subTotal = items
      .map(item => {
        return item.price * item.selectedQuantity;
      })
      .reduce((a, b) => a + b, 0);
    const tax = subTotal * 0.05;

    setCartSum({
      subTotal: Math.round((subTotal / 100) * 100) / 100,
      tax: Math.round((tax / 100) * 100) / 100,
      total: Math.round(((subTotal + tax) / 100) * 100) / 100,
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
