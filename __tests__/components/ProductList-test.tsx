/**
 * @format
 */

import React from 'react';
import 'react-native';
import ProductList from '../../components/ProductList';
import demoProducts from '../../controllers/demoProducts.json';
import UIProvider from '../setup/UIProvider';

import {render, screen, waitFor} from '@testing-library/react-native';
import {RootContext} from '../../context/RootContext';
import productController from '../../controllers/productController';

const mockedRoute = {name: 'Products'};
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    ...mockedRoute,
  }),
}));
jest.mock('../../components/ProductItem', () => 'ProductItem');
jest.spyOn(productController, 'fetchProducts');

describe('ProductList', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockedRoute.name = 'Products';
  });
  it('renders correctly', async () => {
    (productController.fetchProducts as jest.Mock).mockImplementation(() =>
      Promise.resolve(demoProducts.products),
    );

    render(
      <UIProvider>
        <ProductList />
      </UIProvider>,
    );

    await waitFor(() => {
      expect(productController.fetchProducts).toBeCalledTimes(1);
      expect(productController.fetchProducts).toBeCalledWith(
        1,
        undefined,
        undefined,
      );
      expect(screen.queryByText('Latest Products')).toBeOnTheScreen();
    });
  });

  it('renders no products correctly', async () => {
    (productController.fetchProducts as jest.Mock).mockImplementation(() =>
      Promise.resolve([]),
    );

    render(
      <UIProvider>
        <ProductList />
      </UIProvider>,
    );

    await waitFor(() => {
      expect(productController.fetchProducts).toBeCalledTimes(1);
      expect(screen.queryByText('No products found...')).toBeOnTheScreen();
    });
  });

  it('renders username correctly', async () => {
    (productController.fetchProducts as jest.Mock).mockImplementation(() =>
      Promise.resolve([]),
    );
    const user = {username: 'Hasan Abir'};

    render(
      <RootContext.Provider
        value={
          {
            user,
            handleError: jest.fn(),
            clearError: jest.fn(),
            error: null,
          } as any
        }>
        <UIProvider>
          <ProductList />
        </UIProvider>
        ,
      </RootContext.Provider>,
    );

    await waitFor(() => {
      expect(productController.fetchProducts).toBeCalledTimes(1);
      expect(
        screen.queryByText('Welcome, ' + user.username + '!'),
      ).toBeOnTheScreen();
    });
  });
  it('does not render username correctly when in a different route', async () => {
    (productController.fetchProducts as jest.Mock).mockImplementation(() =>
      Promise.resolve([]),
    );
    mockedRoute.name = 'Search';
    const user = {username: 'Hasan Abir'};

    render(
      <RootContext.Provider
        value={
          {
            user,
            handleError: jest.fn(),
            clearError: jest.fn(),
            error: null,
          } as any
        }>
        <UIProvider>
          <ProductList />
        </UIProvider>
        ,
      </RootContext.Provider>,
    );

    await waitFor(() => {
      expect(productController.fetchProducts).toBeCalledTimes(1);
      expect(
        screen.queryByText('Welcome, ' + user.username + '!'),
      ).not.toBeOnTheScreen();
    });
  });
});
