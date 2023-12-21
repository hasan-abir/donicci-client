/**
 * @format
 */

import React from 'react';
import 'react-native';
import ProductList from '../../../components/ProductList';
import demoProducts from '../../e2e/helpers/demoProducts.json';
import UIProvider from '../setup/UIProvider';

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {RootContext} from '../../../context/RootContext';
import productController from '../../../controllers/productController';
import {Box} from '@gluestack-ui/themed';

const mockedRoute = {name: 'Products'};
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    ...mockedRoute,
  }),
}));

jest.mock('../../../components/ProductItem', () => 'ProductItem');

jest.spyOn(productController, 'fetchProducts');

describe('ProductList', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockedRoute.name = 'Products';
  });
  it('renders correctly', async () => {
    const productsList = demoProducts.products;

    (productController.fetchProducts as jest.Mock).mockReturnValue(
      Promise.resolve(productsList),
    );

    render(
      <UIProvider>
        <ProductList />
      </UIProvider>,
    );

    await waitFor(() => {
      expect(productController.fetchProducts).toBeCalledTimes(1);
      expect(productController.fetchProducts).toBeCalledWith(
        undefined,
        undefined,
        undefined,
      );
    });
    expect(screen.queryByTestId('main-heading')).toBeOnTheScreen();
    expect(screen.queryByTestId('main-heading')).toHaveTextContent(
      'Latest products',
    );
  });

  it('loads with appropriate params correctly', async () => {
    (productController.fetchProducts as jest.Mock).mockReturnValue(
      Promise.resolve(demoProducts.products),
    );

    const categoryId = '123';
    const term = 'Nulla';
    const headerTitle = 'Lorem';

    render(
      <UIProvider>
        <ProductList
          categoryId={categoryId}
          term={term}
          headerTitle={headerTitle}
        />
      </UIProvider>,
    );

    await waitFor(() => {
      expect(productController.fetchProducts).toBeCalledTimes(1);
      expect(productController.fetchProducts).toBeCalledWith(
        undefined,
        categoryId,
        term,
      );
    });
    expect(screen.queryByTestId('main-heading')).toBeOnTheScreen();
    expect(screen.queryByTestId('main-heading')).toHaveTextContent(headerTitle);
  });

  it('renders no products correctly', async () => {
    (productController.fetchProducts as jest.Mock).mockReturnValue(
      Promise.resolve([]),
    );

    render(
      <UIProvider>
        <ProductList />
      </UIProvider>,
    );

    await waitFor(() => {
      expect(productController.fetchProducts).toBeCalledTimes(1);
    });
    expect(screen.queryByTestId('no-data-text')).toBeOnTheScreen();
  });

  it('renders username correctly', async () => {
    (productController.fetchProducts as jest.Mock).mockReturnValue(
      Promise.resolve([]),
    );
    const user = {display_name: 'Hasan Abir'};

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
    });

    expect(screen.queryByTestId('user-greeting')).toBeOnTheScreen();
    expect(screen.queryByTestId('user-greeting')).toHaveTextContent(
      'Welcome, ' + user.display_name + '!',
    );
  });
  it('does not render username correctly when in a different route', async () => {
    (productController.fetchProducts as jest.Mock).mockReturnValue(
      Promise.resolve([]),
    );
    mockedRoute.name = 'Search';
    const user = {display_name: 'Hasan Abir'};

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
    });

    expect(screen.queryByTestId('main-heading')).toBeOnTheScreen();
    expect(screen.queryByTestId('main-heading')).not.toHaveTextContent(
      'Welcome, ' + user.display_name + '!',
    );
  });
});
