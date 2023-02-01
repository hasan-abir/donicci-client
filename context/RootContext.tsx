import React, {useState} from 'react';
import type {Product} from '../components/ProductItem';

type CartSum = {
  subTotal: number;
  tax: number;
  total: number;
};

type CartItem = Product & {
  selectedQuantity: number;
};

type Value = {
  cartItems: CartItem[];
  addItemToCart: (cartItem: CartItem) => void;
  removeItemFromCart: (id: string) => void;
  inCart: (productId: string) => boolean;
  cartSum: CartSum;
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

  const calculateTheTotals = () => {
    const subTotal = cartItems
      .map(item => {
        if (item.quantity) {
          return item.price * item.quantity;
        } else {
          return 0;
        }
      })
      .reduce((a, b) => a + b, 0);
    const tax = subTotal * 0.05;

    setCartSum({
      subTotal,
      tax,
      total: subTotal + tax,
    });
  };

  const addItemToCart = (cartItem: CartItem) => {
    setCartItems(state => [...state, cartItem]);

    calculateTheTotals();
  };

  const removeItemFromCart = (id: string) => {
    setCartItems(state => state.filter(item => item._id !== id));

    calculateTheTotals();
  };

  const inCart = (productId: string) => {
    return cartItems.map(item => item._id).includes(productId);
  };
  return (
    <RootContext.Provider
      value={{cartItems, cartSum, addItemToCart, removeItemFromCart, inCart}}>
      {children}
    </RootContext.Provider>
  );
};

export default RootContextProvider;
