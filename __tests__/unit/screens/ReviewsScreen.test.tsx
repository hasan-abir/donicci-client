/**
 * @format
 */

import React from 'react';
import 'react-native';
import ReviewsScreen from '../../../screens/ReviewsScreen';
import UIProvider from '../setup/UIProvider';

import {fireEvent, render, screen, waitFor} from '@testing-library/react-native';
import {RootContext} from '../../../context/RootContext';
import reviewController from '../../../controllers/reviewController';
import demoReviews from '../../e2e/helpers/demoReviews.json';

jest.mock('../../../components/PostReview', () => 'PostReview');
jest.mock('../../../components/UserReview', () => 'UserReview');

jest.spyOn(reviewController, 'fetchReviews');

describe('ReviewsScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders correctly', async () => {
    const reviewsList = demoReviews.reviews.slice(0, 5);

    const route = {name: 'Reviews', params: {productId: '123'}};
    const navigation = {
      setOptions: jest.fn(),
      navigate: jest.fn(),
    };
    const clearError = jest.fn();
    const handleError = jest.fn();
    const user = null;
    const error = null;

    const props = {
      route,
      navigation,
    };

    (reviewController.fetchReviews as jest.Mock).mockReturnValue(
      Promise.resolve(reviewsList),
    );

    render(
      <UIProvider>
        <RootContext.Provider
          value={{handleError, clearError, user, error} as any}>
          <ReviewsScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(reviewController.fetchReviews).toBeCalledTimes(1);
      expect(reviewController.fetchReviews).toBeCalledWith(
        route.params.productId,
        undefined,
      );
    });

    expect(screen.queryByTestId('reviews-heading')).toBeOnTheScreen();
    expect(screen.queryByTestId('reviews-heading')).toHaveTextContent(
      'User Reviews',
    );

    expect(screen.queryAllByTestId('flat-list-item').length).toBe(
      reviewsList.length,
    );
  });
  it('renders no reviews correctly', async () => {
    const route = {name: 'Reviews', params: {productId: '123'}};
    const navigation = {
      setOptions: jest.fn(),
      navigate: jest.fn(),
    };
    const clearError = jest.fn();
    const handleError = jest.fn();
    const user = null;
    const error = null;

    const props = {
      route,
      navigation,
    };

    (reviewController.fetchReviews as jest.Mock).mockReturnValue(
      Promise.resolve([]),
    );

    render(
      <UIProvider>
        <RootContext.Provider
          value={{handleError, clearError, user, error} as any}>
          <ReviewsScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(reviewController.fetchReviews).toBeCalledTimes(1);
    });

    expect(screen.queryByTestId('no-data-text')).toBeOnTheScreen();
    expect(screen.queryAllByTestId('flat-list-item').length).toBe(0);
  });
  it('loads more reviews correctly', async () => {
    const route = {name: 'Reviews', params: {productId: '123'}};
    const navigation = {
      setOptions: jest.fn(),
      navigate: jest.fn(),
    };
    const clearError = jest.fn();
    const handleError = jest.fn();
    const user = null;
    const error = null;

    const props = {
      route,
      navigation,
    };

    const firstResult = Promise.resolve(demoReviews.reviews.slice(0, 5));
    const secondResult = Promise.resolve(demoReviews.reviews.slice(6, 10));

    (reviewController.fetchReviews as jest.Mock)
      .mockReturnValueOnce(firstResult)
      .mockReturnValueOnce(secondResult);

    render(
      <UIProvider>
        <RootContext.Provider
          value={{handleError, clearError, user, error} as any}>
          <ReviewsScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(reviewController.fetchReviews).toBeCalledTimes(1);
      expect(reviewController.fetchReviews).toHaveReturnedWith(firstResult);
    });

    expect(screen.queryAllByTestId('flat-list-item').length).toBe(
      5
    );

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
        expect(reviewController.fetchReviews).toHaveReturnedWith(
          secondResult,
        );
      });
  });
});
