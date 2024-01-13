/**
 * @format
 */

import React from 'react';
import 'react-native';
import {RootContext} from '../../../context/RootContext';
import demoCartItems from '../../e2e/helpers/demoCartItems.json';
import CartScreen from '../../../screens/CartScreen';
import UIProvider from '../setup/UIProvider';

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import cartItemController from '../../../controllers/cartItemController';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const handleError = jest.fn();

    const tokens = {
      access: '234',
      refresh: '456',
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(tokens.access);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(tokens.refresh);
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
            } as any
          }>
          <CartScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
      expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');
      expect(cartItemController.fetchCartItems).toBeCalledTimes(1);
      expect(cartItemController.fetchCartItems).toBeCalledWith(tokens.access);
    });

    expect(screen.queryByText('$' + cartSum.subTotal / 100));
    expect(screen.queryByText('$' + cartSum.tax / 100));
    expect(screen.queryByText('$' + cartSum.total / 100));
  });

  it("doesn't fetch items when unauthorized", async () => {
    const props = {route: {name: 'Cart'}};
    const cartSum = {subTotal: 80, tax: 2, total: 82};
    const clearCart = jest.fn();
    const user = {username: 'Hasan Abir'};
    const handleError = jest.fn();

    const tokens = {
      access: '234',
      refresh: '456',
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
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
            } as any
          }>
          <CartScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
      expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');
      expect(cartItemController.fetchCartItems).toBeCalledTimes(0);
    });

    expect(screen.queryByText('$' + cartSum.subTotal / 100));
    expect(screen.queryByText('$' + cartSum.tax / 100));
    expect(screen.queryByText('$' + cartSum.total / 100));
  });
  it('clear cart correctly', async () => {
    const props = {route: {name: 'Cart'}};
    const cartSum = {subTotal: 80, tax: 2, total: 82};
    const clearCart = jest.fn(() => Promise.resolve(null));
    const user = {username: 'Hasan Abir'};
    const handleError = jest.fn();

    const tokens = {
      access: '234',
      refresh: '456',
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(tokens.access);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(tokens.refresh);
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
            } as any
          }>
          <CartScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
      expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');
    });

    fireEvent.press(screen.getByTestId('clear-cart-btn'));

    await waitFor(() => {
      expect(clearCart).toBeCalledTimes(1);
      expect(clearCart).toBeCalledWith(props.route.name);
    });
  });
});
