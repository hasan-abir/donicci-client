/**
 * @format
 */

import React from 'react';
import 'react-native';
import TabBar from '../../../components/TabBar';
import UIProvider from '../setup/UIProvider';

import {fireEvent, render, screen} from '@testing-library/react-native';
import {RootContext} from '../../../context/RootContext';

describe('TabBar', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders correctly', async () => {
    const cartItems = [1, 2];
    const state = {
      index: 1,
      routes: [{name: 'Products'}, {name: 'Cart'}, {name: 'Categories'}],
    };
    const navigation = {navigate: jest.fn()};

    render(
      <UIProvider>
        <RootContext.Provider value={{cartItems} as any}>
          <TabBar
            state={state as any}
            descriptors={null as any}
            navigation={navigation as any}
            insets={null as any}
          />
        </RootContext.Provider>
      </UIProvider>,
    );

    for (let i = 0; i < state.routes.length; i++) {
      const route = state.routes[i];

      const navBtn = screen.getByTestId(route.name + '-btn');
      const label = screen.queryByTestId(route.name + '-label');

      expect(navBtn).toBeOnTheScreen();

      if (route.name === 'Cart') {
        expect(screen.queryByTestId('cart-items-length')).toBeOnTheScreen();
        expect(screen.queryByTestId('cart-items-length')).toHaveTextContent(
          cartItems.length.toString(),
        );
      }

      if (state.index === i) {
        expect(label).toBeOnTheScreen();
      } else {
        expect(label).not.toBeOnTheScreen();
      }

      fireEvent.press(navBtn);

      expect(navigation.navigate).toBeCalledWith(route.name);
    }
  });
});
