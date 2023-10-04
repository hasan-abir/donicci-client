/**
 * @format
 */

import React from 'react';
import 'react-native';
import ProductList from '../../components/ProductList';
import demoProducts from '../../controllers/demoProducts.json';
import UIProvider from '../setup/UIProvider';

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
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
        1,
        undefined,
        undefined,
      );
    });
    expect(screen.queryByText('Latest products')).toBeOnTheScreen();
    expect(screen.queryAllByTestId('flat-list-item').length).toBe(
      productsList.length,
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
        1,
        categoryId,
        term,
      );
    });
    expect(screen.queryByText(headerTitle)).toBeOnTheScreen();
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
    expect(screen.queryByText('No products found...')).toBeOnTheScreen();
    expect(screen.queryAllByTestId('flat-list-item').length).toBe(0);
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

    expect(
      screen.queryByText('Welcome, ' + user.display_name + '!'),
    ).toBeOnTheScreen();
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

    expect(
      screen.queryByText('Welcome, ' + user.display_name + '!'),
    ).not.toBeOnTheScreen();
  });
  it('loads more products correctly', async () => {
    const firstResult = Promise.resolve(demoProducts.products.slice(0, 5));
    const secondResult = Promise.resolve(demoProducts.products.slice(6, 10));

    (productController.fetchProducts as jest.Mock)
      .mockReturnValueOnce(firstResult)
      .mockReturnValueOnce(secondResult);

    render(
      <UIProvider>
        <ProductList />
      </UIProvider>,
    );

    await waitFor(() => {
      expect(productController.fetchProducts).toBeCalledTimes(1);
      expect(productController.fetchProducts).toHaveReturnedWith(firstResult);
    });

    expect(screen.queryAllByTestId('flat-list-item').length).toBe(5);

    const eventData = {
      nativeEvent: {
        contentOffset: {
          y: 500,
        },
        contentSize: {
          // Dimensions of the scrollable content
          height: 500,
          width: 100,
        },
        layoutMeasurement: {
          // Dimensions of the device
          height: 100,
          width: 100,
        },
      },
    };

    fireEvent.scroll(screen.getByTestId('flat-list'), eventData);

    await waitFor(() => {
      expect(productController.fetchProducts).toBeCalledTimes(1);
      expect(productController.fetchProducts).toHaveReturnedWith(secondResult);
    });
  });
});
