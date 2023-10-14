/**
 * @format
 */

import React from 'react';
import 'react-native';
import CartItemDetails from '../../../components/CartItemDetails';
import {CartItem, RootContext} from '../../../context/RootContext';
import demoCartItems from '../../../controllers/demoCartItems.json';
import demoProducts from '../../../controllers/demoProducts.json';
import UIProvider from '../setup/UIProvider';

import {fireEvent, render, screen} from '@testing-library/react-native';

const mockedRoute = {name: 'Cart'};
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    ...mockedRoute,
  }),
}));

describe('CartItemDetails', () => {
  it('renders correctly', () => {
    const cartItem: CartItem = {
      ...demoCartItems.cartItems[0],
      product: {
        ...demoProducts.products[0],
      },
      selectedQuantity: 10,
    };

    render(
      <UIProvider>
        <CartItemDetails item={cartItem} />
      </UIProvider>,
    );

    expect(screen.queryByText(cartItem.product.title)).toBeOnTheScreen();
    expect(screen.queryByText('$' + cartItem.product.price)).toBeOnTheScreen();
    expect(
      screen.queryByText(
        '$' +
          Math.round(cartItem.product.price * cartItem.selectedQuantity * 100) /
            100,
      ),
    ).toBeOnTheScreen();
    expect(
      screen.queryByText(
        cartItem.selectedQuantity + ' of ' + cartItem.product.quantity,
      ),
    ).toBeOnTheScreen();
  });

  it('increases quantity correctly', () => {
    const updateSelectedQuantity = jest.fn();

    const cartItem: CartItem = {
      ...demoCartItems.cartItems[0],
      product: {
        ...demoProducts.products[0],
      },
      selectedQuantity: 10,
    };

    render(
      <UIProvider>
        <RootContext.Provider value={{updateSelectedQuantity} as any}>
          <CartItemDetails item={cartItem} />
        </RootContext.Provider>
      </UIProvider>,
    );

    fireEvent.press(screen.getByTestId('increase-quantity'));

    expect(updateSelectedQuantity).toBeCalledTimes(1);
    expect(updateSelectedQuantity).toBeCalledWith(cartItem._id, true);
  });

  it('decreases quantity correctly', () => {
    const updateSelectedQuantity = jest.fn();

    const cartItem: CartItem = {
      ...demoCartItems.cartItems[0],
      product: {
        ...demoProducts.products[0],
      },
      selectedQuantity: 10,
    };

    render(
      <UIProvider>
        <RootContext.Provider value={{updateSelectedQuantity} as any}>
          <CartItemDetails item={cartItem} />
        </RootContext.Provider>
      </UIProvider>,
    );

    fireEvent.press(screen.getByTestId('decrease-quantity'));

    expect(updateSelectedQuantity).toBeCalledTimes(1);
    expect(updateSelectedQuantity).toBeCalledWith(cartItem._id, false);
  });
  it('removes cart item correctly', () => {
    const removeItemFromCart = jest.fn();

    const cartItem: CartItem = {
      ...demoCartItems.cartItems[0],
      product: {
        ...demoProducts.products[0],
      },
      selectedQuantity: 10,
    };

    render(
      <UIProvider>
        <RootContext.Provider value={{removeItemFromCart} as any}>
          <CartItemDetails item={cartItem} />
        </RootContext.Provider>
      </UIProvider>,
    );

    fireEvent.press(screen.getByText('REMOVE'));

    expect(removeItemFromCart).toBeCalledTimes(1);
    expect(removeItemFromCart).toBeCalledWith(cartItem._id, mockedRoute.name);
  });
});
