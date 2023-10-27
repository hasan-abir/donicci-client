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
import demoReviews from '../../../controllers/demoReviews.json';
import {Review} from '../../../components/UserReview';

jest.mock('../../../components/PostReview', () => 'PostReview');
jest.mock('../../../components/ProductDetails', () => 'ProductDetails');
jest.mock('../../../components/UserReview', () => 'UserReview');
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
    expect(screen.queryByText('User Reviews')).toBeOnTheScreen();
  });
});
