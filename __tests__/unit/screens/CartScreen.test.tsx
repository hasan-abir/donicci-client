/**
 * @format
 */

import React from 'react';
import 'react-native';
import {RootContext} from '../../../context/RootContext';
import demoCartItems from '../../../controllers/demoCartItems.json';
import CartScreen from '../../../screens/CartScreen';
import UIProvider from '../setup/UIProvider';

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import cartItemController from '../../../controllers/cartItemController';

jest.mock('../../../components/CartItemDetails', () => 'CartItemDetails');
jest.spyOn(cartItemController, 'fetchCartItems');

describe('CartScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders correctly', async () => {
    const props = {route: {name: 'Cart'}};
    const cartSum = {subTotal: 80, tax: 2, total: 82};
    const clearCart = jest.fn();
    const user = {username: 'Hasan Abir'};
    const token = '123';
    const handleError = jest.fn();

    (cartItemController.fetchCartItems as jest.Mock).mockReturnValue(
      Promise.resolve(),
    );

    render(
      <UIProvider>
        <RootContext.Provider
          value={
            {
              cartItems: demoCartItems.cartItems,
              cartSum,
              clearCart,
              user,
              handleError,
              token,
            } as any
          }>
          <CartScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(cartItemController.fetchCartItems).toBeCalledTimes(1);
      expect(cartItemController.fetchCartItems).toBeCalledWith(token);
    });

    expect(screen.queryByText('$' + cartSum.subTotal));
    expect(screen.queryByText('$' + cartSum.tax));
    expect(screen.queryByText('$' + cartSum.total));
  });
  it('clear cart correctly', async () => {
    const props = {route: {name: 'Cart'}};
    const cartSum = {subTotal: 80, tax: 2, total: 82};
    const clearCart = jest.fn();
    const user = {username: 'Hasan Abir'};
    const token = '123';
    const handleError = jest.fn();

    (cartItemController.fetchCartItems as jest.Mock).mockReturnValue(
      Promise.resolve(),
    );

    render(
      <UIProvider>
        <RootContext.Provider
          value={
            {
              cartItems: demoCartItems.cartItems,
              cartSum,
              clearCart,
              user,
              handleError,
              token,
            } as any
          }>
          <CartScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(cartItemController.fetchCartItems).toBeCalledTimes(1);
      expect(cartItemController.fetchCartItems).toBeCalledWith(token);
    });

    fireEvent.press(screen.getByText('Clear Cart'));
    expect(clearCart).toBeCalledTimes(2);
  });
  it('purchases correctly', async () => {
    const props = {route: {name: 'Cart'}};
    const cartSum = {subTotal: 80, tax: 2, total: 82};
    const clearCart = jest.fn();
    const user = {username: 'Hasan Abir'};
    const token = '123';
    const handleError = jest.fn();

    (cartItemController.fetchCartItems as jest.Mock).mockReturnValue(
      Promise.resolve(),
    );

    render(
      <UIProvider>
        <RootContext.Provider
          value={
            {
              cartItems: demoCartItems.cartItems,
              cartSum,
              clearCart,
              user,
              handleError,
              token,
            } as any
          }>
          <CartScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(cartItemController.fetchCartItems).toBeCalledTimes(1);
      expect(cartItemController.fetchCartItems).toBeCalledWith(token);
    });

    fireEvent.press(screen.getByText('Purchase'));
    expect(clearCart).toBeCalledTimes(2);
  });
});
