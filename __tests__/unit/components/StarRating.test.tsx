/**
 * @format
 */

import React from 'react';
import 'react-native';
import StarRating from '../../../components/StarRating';
import UIProvider from '../setup/UIProvider';

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import ratingController from '../../../controllers/ratingController';
import {RootContext} from '../../../context/RootContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockedRoute = {name: 'ProductDetails'};
const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockedNavigate,
  }),
  useRoute: () => ({
    ...mockedRoute,
  }),
}));
jest.spyOn(ratingController, 'addRating');

describe('StarRating', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders correctly', async () => {
    const rating = 2.5;
    const productId = '123';

    render(
      <UIProvider>
        <RootContext.Provider
          value={{handleError: jest.fn(), clearError: jest.fn()} as any}>
          <StarRating rating={rating} productId={productId} />
        </RootContext.Provider>
      </UIProvider>,
    );

    expect(screen.queryByTestId('rating')).toBeOnTheScreen();
    expect(screen.queryByTestId('rating')).toHaveTextContent(rating.toString());
  });
  it('when unauthorized, navigates correctly', async () => {
    const rating = 2.5;
    const productId = '123';

    render(
      <UIProvider>
        <RootContext.Provider
          value={{handleError: jest.fn(), clearError: jest.fn()} as any}>
          <StarRating rating={rating} productId={productId} />
        </RootContext.Provider>
      </UIProvider>,
    );

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    expect(screen.queryByText(rating.toString())).toBeOnTheScreen();

    fireEvent.press(screen.getByTestId('one-star-rating'));

    await waitFor(() => {
      expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
      expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');
    });

    expect(mockedNavigate).toBeCalledTimes(1);
    expect(mockedNavigate).toBeCalledWith('Login');
  });
  it('when authorized, submits rating correctly', async () => {
    const rating = 2.5;
    let updatedRating = 1;
    const productId = '123';
    const tokens = {
      access: '234',
      refresh: '456',
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(tokens.access);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(tokens.refresh);
    (ratingController.addRating as jest.Mock).mockReturnValueOnce(
      Promise.resolve(updatedRating),
    );

    render(
      <UIProvider>
        <RootContext.Provider
          value={
            {
              handleError: jest.fn(),
              clearError: jest.fn(),
              user: {username: 'Hasan Abir'},
            } as any
          }>
          <StarRating rating={rating} productId={productId} />
        </RootContext.Provider>
      </UIProvider>,
    );

    expect(screen.queryByTestId('rating')).toBeOnTheScreen();
    expect(screen.queryByTestId('rating')).toHaveTextContent(rating.toString());

    fireEvent.press(screen.getByTestId('one-star-rating'));

    await waitFor(() => {
      expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
      expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');
      expect(ratingController.addRating).toBeCalledTimes(1);
      expect(ratingController.addRating).toBeCalledWith(
        productId,
        updatedRating,
        tokens.access,
      );
    });

    expect(screen.queryByTestId('rating')).toHaveTextContent(
      updatedRating.toString(),
    );

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(tokens.access);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(tokens.refresh);
    updatedRating = 2;
    (ratingController.addRating as jest.Mock).mockReturnValueOnce(
      Promise.resolve(updatedRating),
    );

    fireEvent.press(screen.getByTestId('two-star-rating'));

    await waitFor(() => {
      expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
      expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');
      expect(ratingController.addRating).toBeCalledTimes(2);
      expect(ratingController.addRating).toBeCalledWith(
        productId,
        updatedRating,
        tokens.access,
      );
    });

    expect(screen.queryByTestId('rating')).toHaveTextContent(
      updatedRating.toString(),
    );

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(tokens.access);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(tokens.refresh);
    updatedRating = 3;
    (ratingController.addRating as jest.Mock).mockReturnValueOnce(
      Promise.resolve(updatedRating),
    );

    fireEvent.press(screen.getByTestId('three-star-rating'));

    await waitFor(() => {
      expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
      expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');
      expect(ratingController.addRating).toBeCalledTimes(3);
      expect(ratingController.addRating).toBeCalledWith(
        productId,
        updatedRating,
        tokens.access,
      );
    });

    expect(screen.queryByTestId('rating')).toHaveTextContent(
      updatedRating.toString(),
    );

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(tokens.access);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(tokens.refresh);
    updatedRating = 4;
    (ratingController.addRating as jest.Mock).mockReturnValueOnce(
      Promise.resolve(updatedRating),
    );

    fireEvent.press(screen.getByTestId('four-star-rating'));

    await waitFor(() => {
      expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
      expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');
      expect(ratingController.addRating).toBeCalledTimes(4);
      expect(ratingController.addRating).toBeCalledWith(
        productId,
        updatedRating,
        tokens.access,
      );
    });

    expect(screen.queryByTestId('rating')).toHaveTextContent(
      updatedRating.toString(),
    );

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(tokens.access);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(tokens.refresh);
    updatedRating = 5;
    (ratingController.addRating as jest.Mock).mockReturnValueOnce(
      Promise.resolve(updatedRating),
    );

    fireEvent.press(screen.getByTestId('five-star-rating'));

    await waitFor(() => {
      expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
      expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');
      expect(ratingController.addRating).toBeCalledTimes(5);
      expect(ratingController.addRating).toBeCalledWith(
        productId,
        updatedRating,
        tokens.access,
      );
    });

    expect(screen.queryByTestId('rating')).toHaveTextContent(
      updatedRating.toString(),
    );
  });
});
