/**
 * @format
 */
import React from 'react';
import 'react-native';
import UserReview from '../../components/UserReview';
import UIProvider from '../setup/UIProvider';

import {render, screen} from '@testing-library/react-native';
import demoReviews from '../../controllers/demoReviews.json';

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockedNavigate,
  }),
}));

describe('UserReview', () => {
  it('renders correctly', () => {
    const review = demoReviews.reviews[0];

    render(
      <UIProvider>
        <UserReview review={review} />
      </UIProvider>,
    );

    expect(screen.queryByText(review.author + ' says,')).toBeOnTheScreen();
    expect(screen.queryByText(review.description)).toBeOnTheScreen();
  });
});
