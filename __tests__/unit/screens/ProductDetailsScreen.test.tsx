/**
 * @format
 */

import React from 'react';
import 'react-native';
import ProductDetailsScreen from '../../../screens/ProductDetailsScreen';
import UIProvider from '../setup/UIProvider';

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {RootContext} from '../../../context/RootContext';
import productController from '../../../controllers/productController';
import reviewController from '../../../controllers/reviewController';
import demoProducts from '../../e2e/helpers/demoProducts.json';

jest.mock('../../../components/ProductDetails', () => 'ProductDetails');
jest.spyOn(productController, 'fetchSingleProduct');
jest.spyOn(reviewController, 'fetchReviews');

describe('ProductDetailsScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders correctly', async () => {
    const navigate = jest.fn();
    const setOptions = jest.fn();
    const clearError = jest.fn();
    const handleError = jest.fn();
    const route = {
      name: 'ProductDetails',
      params: {productId: '123'},
    };

    const props = {
      navigation: {
        navigate,
        setOptions,
      },
      route,
    };

    const product = demoProducts.products[0];

    (productController.fetchSingleProduct as jest.Mock).mockReturnValue(
      Promise.resolve(product),
    );

    render(
      <UIProvider>
        <RootContext.Provider value={{clearError, handleError} as any}>
          <ProductDetailsScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(productController.fetchSingleProduct).toBeCalledTimes(1);
      expect(productController.fetchSingleProduct).toBeCalledWith(
        route.params.productId,
      );
    });
    expect(screen.queryByTestId('to-reviews-btn')).toBeOnTheScreen();
  });
  it('calls navigate to reviews correctly', async () => {
    const navigate = jest.fn();
    const setOptions = jest.fn();
    const clearError = jest.fn();
    const handleError = jest.fn();
    const route = {
      name: 'ProductDetails',
      params: {productId: '123'},
    };

    const props = {
      navigation: {
        navigate,
        setOptions,
      },
      route,
    };

    const product = demoProducts.products[0];

    (productController.fetchSingleProduct as jest.Mock).mockReturnValue(
      Promise.resolve(product),
    );

    render(
      <UIProvider>
        <RootContext.Provider value={{clearError, handleError} as any}>
          <ProductDetailsScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(productController.fetchSingleProduct).toBeCalledTimes(1);
      expect(productController.fetchSingleProduct).toBeCalledWith(
        route.params.productId,
      );
    });
    expect(screen.queryByTestId('to-reviews-btn')).toBeOnTheScreen();
    fireEvent.press(screen.getByTestId('to-reviews-btn'));

    expect(navigate).toBeCalledTimes(1);
    expect(navigate).toBeCalledWith('Reviews', {productId: product._id});
  });
  it('renders correctly when no product found', async () => {
    const navigate = jest.fn();
    const setOptions = jest.fn();
    const clearError = jest.fn();
    const handleError = jest.fn();
    const route = {
      name: 'ProductDetails',
      params: {productId: '123'},
    };

    const props = {
      navigation: {
        navigate,
        setOptions,
      },
      route,
    };

    (productController.fetchSingleProduct as jest.Mock).mockReturnValue(
      Promise.resolve(null),
    );

    render(
      <UIProvider>
        <RootContext.Provider value={{clearError, handleError} as any}>
          <ProductDetailsScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(productController.fetchSingleProduct).toBeCalledTimes(1);
      expect(productController.fetchSingleProduct).toBeCalledWith(
        route.params.productId,
      );
    });
    expect(screen.queryByTestId('not-found-text')).toBeOnTheScreen();
  });
});
