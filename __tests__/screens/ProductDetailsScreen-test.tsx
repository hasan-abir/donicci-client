/**
 * @format
 */

import React from 'react';
import 'react-native';
import ProductDetailsScreen from '../../screens/ProductDetailsScreen';
import UIProvider from '../setup/UIProvider';

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {RootContext} from '../../context/RootContext';
import productController from '../../controllers/productController';
import reviewController from '../../controllers/reviewController';
import demoProducts from '../../controllers/demoProducts.json';
import demoReviews from '../../controllers/demoReviews.json';
import {Review} from '../../components/UserReview';

jest.mock('../../components/PostReview', () => 'PostReview');
jest.mock('../../components/ProductDetails', () => 'ProductDetails');
jest.mock('../../components/UserReview', () => 'UserReview');
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
    const reviewsList = demoReviews.reviews.slice(0, 10);

    (productController.fetchSingleProduct as jest.Mock).mockReturnValue(
      Promise.resolve(product),
    );
    (reviewController.fetchReviews as jest.Mock).mockReturnValue(
      Promise.resolve(reviewsList),
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
      expect(reviewController.fetchReviews).toBeCalledTimes(1);
      expect(reviewController.fetchReviews).toBeCalledWith(1, product._id);
    });
    expect(screen.queryByText('User Reviews')).toBeOnTheScreen();
    expect(screen.queryAllByTestId('flat-list-item').length).toBe(
      reviewsList.length,
    );
  });
  it('renders no reviews correctly', async () => {
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
    const reviewsList: Review[] = [];

    (productController.fetchSingleProduct as jest.Mock).mockReturnValue(
      Promise.resolve(product),
    );
    (reviewController.fetchReviews as jest.Mock).mockReturnValue(
      Promise.resolve(reviewsList),
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
      expect(reviewController.fetchReviews).toBeCalledTimes(1);
      expect(reviewController.fetchReviews).toBeCalledWith(1, product._id);
    });
    expect(screen.queryByText('No reviews found...')).toBeOnTheScreen();
  });
  it('loads more reviews correctly', async () => {
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
    const firstResult = Promise.resolve(demoReviews.reviews.slice(0, 5));
    const secondResult = Promise.resolve(demoReviews.reviews.slice(6, 10));

    (productController.fetchSingleProduct as jest.Mock).mockReturnValue(
      Promise.resolve(product),
    );
    (reviewController.fetchReviews as jest.Mock)
      .mockReturnValueOnce(firstResult)
      .mockReturnValueOnce(secondResult);

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
      expect(reviewController.fetchReviews).toBeCalledTimes(1);
      expect(reviewController.fetchReviews).toHaveReturnedWith(firstResult);
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
      expect(reviewController.fetchReviews).toBeCalledTimes(1);
      expect(reviewController.fetchReviews).toHaveReturnedWith(secondResult);
    });
  });
});
