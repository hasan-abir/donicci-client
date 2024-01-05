/**
 * @format
 */

import React from 'react';
import 'react-native';
import CartItemDetails from '../../../components/CartItemDetails';
import {CartItem, RootContext} from '../../../context/RootContext';
import demoCartItems from '../../e2e/helpers/demoCartItems.json';
import demoProducts from '../../e2e/helpers/demoProducts.json';
import UIProvider from '../setup/UIProvider';

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';

const mockedRoute = {name: 'Cart'};
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    ...mockedRoute,
  }),
}));

describe('CartItemDetails', () => {
  it('renders correctly', () => {
    const cartItem: CartItem = demoCartItems.cartItems[0];

    render(
      <UIProvider>
        <CartItemDetails item={cartItem} />
      </UIProvider>,
    );

    expect(screen.queryByText(cartItem.product_title)).toBeOnTheScreen();
    expect(
      screen.queryByText('$' + cartItem.product_price / 100),
    ).toBeOnTheScreen();
    expect(
      screen.queryByText(
        '$' +
          Math.round(cartItem.product_price * cartItem.selected_quantity) / 100,
      ),
    ).toBeOnTheScreen();
    expect(
      screen.queryByText(
        cartItem.selected_quantity + ' of ' + cartItem.product_quantity,
      ),
    ).toBeOnTheScreen();
  });

  it('increases quantity correctly', () => {
    const updateSelectedQuantity = jest.fn();

    const cartItem: CartItem = demoCartItems.cartItems[0];

    render(
      <UIProvider>
        <RootContext.Provider value={{updateSelectedQuantity} as any}>
          <CartItemDetails item={cartItem} />
        </RootContext.Provider>
      </UIProvider>,
    );

    fireEvent.press(
      screen.getByTestId('item-' + cartItem.product_id + '-increase-quantity'),
    );

    expect(updateSelectedQuantity).toBeCalledTimes(1);
    expect(updateSelectedQuantity).toBeCalledWith(cartItem._id, true);
  });

  it('decreases quantity correctly', () => {
    const updateSelectedQuantity = jest.fn();

    const cartItem: CartItem = demoCartItems.cartItems[0];

    render(
      <UIProvider>
        <RootContext.Provider value={{updateSelectedQuantity} as any}>
          <CartItemDetails item={cartItem} />
        </RootContext.Provider>
      </UIProvider>,
    );

    fireEvent.press(
      screen.getByTestId('item-' + cartItem.product_id + '-decrease-quantity'),
    );

    expect(updateSelectedQuantity).toBeCalledTimes(1);
    expect(updateSelectedQuantity).toBeCalledWith(cartItem._id, false);
  });
  it('removes cart item correctly', async () => {
    const removeItemFromCart = jest.fn(() => Promise.resolve(null));

    const cartItem: CartItem = demoCartItems.cartItems[0];

    render(
      <UIProvider>
        <RootContext.Provider value={{removeItemFromCart} as any}>
          <CartItemDetails item={cartItem} />
        </RootContext.Provider>
      </UIProvider>,
    );

    const removeBtn = screen.getByTestId(
      'item-' + cartItem.product_id + '-remove',
    );

    await act(async () => {
      fireEvent.press(removeBtn);

      await waitFor(() => {
        expect(removeItemFromCart).toBeCalledTimes(1);
        expect(removeItemFromCart).toBeCalledWith(
          cartItem.product_id,
          mockedRoute.name,
        );
      });

      expect(removeBtn).not.toBeDisabled();
    });
  });
});
