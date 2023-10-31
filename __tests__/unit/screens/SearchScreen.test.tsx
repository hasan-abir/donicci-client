/**
 * @format
 */

import React from 'react';
import 'react-native';
import SearchScreen from '../../../screens/SearchScreen';
import UIProvider from '../setup/UIProvider';

import {render, screen} from '@testing-library/react-native';
import {RootContext} from '../../../context/RootContext';

jest.mock('../../../components/ProductList', () => 'ProductList');

describe('SearchScreen', () => {
  it('renders correctly', async () => {
    const route = {name: 'Search', params: {term: 'Lorem'}};
    const clearError = jest.fn();

    const props = {
      route,
    };

    render(
      <UIProvider>
        <RootContext.Provider value={{clearError} as any}>
          <SearchScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    expect(screen.queryByTestId('instruction')).not.toBeOnTheScreen();
  });
  it('renders prompt to search correctly', async () => {
    const route = {name: 'Search', params: {term: ''}};
    const clearError = jest.fn();

    const props = {
      route,
    };

    render(
      <UIProvider>
        <RootContext.Provider value={{clearError} as any}>
          <SearchScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    expect(screen.queryByTestId('instruction')).toBeOnTheScreen();
  });
});
