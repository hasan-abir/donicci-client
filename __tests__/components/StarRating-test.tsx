/**
 * @format
 */

import React from 'react';
import 'react-native';
import StarRating from '../../components/StarRating';
import UIProvider from '../setup/UIProvider';

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import ratingController from '../../controllers/ratingController';
import {RootContext} from '../../context/RootContext';

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
jest.spyOn(ratingController, 'fetchRatings');
jest.spyOn(ratingController, 'addRating');

describe('StarRating', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders correctly', async () => {
    const rating = 2.5;
    const productId = '123';
    (ratingController.fetchRatings as jest.Mock).mockReturnValue(
      Promise.resolve(rating),
    );

    render(
      <UIProvider>
        <RootContext.Provider
          value={{handleError: jest.fn(), clearError: jest.fn()} as any}>
          <StarRating productId={productId} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(ratingController.fetchRatings).toBeCalledTimes(1);
      expect(ratingController.fetchRatings).toBeCalledWith(productId);
    });
    expect(screen.queryByText('Rating - ' + rating)).toBeOnTheScreen();
  });
  it('when unauthorized, navigates correctly', async () => {
    const rating = 2.5;
    const productId = '123';
    (ratingController.fetchRatings as jest.Mock).mockReturnValue(
      Promise.resolve(rating),
    );
    (ratingController.addRating as jest.Mock).mockReturnValue(
      Promise.resolve(rating),
    );

    render(
      <UIProvider>
        <RootContext.Provider
          value={{handleError: jest.fn(), clearError: jest.fn()} as any}>
          <StarRating productId={productId} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(ratingController.fetchRatings).toBeCalledTimes(1);
      expect(ratingController.fetchRatings).toBeCalledWith(productId);
    });

    expect(screen.queryByText('Rating - ' + rating)).toBeOnTheScreen();

    fireEvent.press(screen.getByTestId('star'));

    expect(mockedNavigate).toBeCalledTimes(1);
    expect(mockedNavigate).toBeCalledWith('Login');
  });
  it('when authorized, submits rating correctly', async () => {
    const rating = 2.5;
    const updatedRating = 3;
    const productId = '123';
    const token = '456';
    (ratingController.fetchRatings as jest.Mock).mockReturnValue(
      Promise.resolve(rating),
    );
    (ratingController.addRating as jest.Mock).mockReturnValue(
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
              token,
            } as any
          }>
          <StarRating productId={productId} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(ratingController.fetchRatings).toBeCalledTimes(1);
      expect(ratingController.fetchRatings).toBeCalledWith(productId);
    });

    expect(screen.queryByText('Rating - ' + rating)).toBeOnTheScreen();

    fireEvent.press(screen.getByTestId('star'));

    await waitFor(() => {
      expect(ratingController.addRating).toBeCalledTimes(1);
      expect(ratingController.addRating).toBeCalledWith(productId, 3, token);
    });

    expect(screen.queryByText('Rating - ' + updatedRating)).toBeOnTheScreen();
  });
});
