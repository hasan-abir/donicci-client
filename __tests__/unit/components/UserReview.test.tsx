/**
 * @format
 */
import React from 'react';
import 'react-native';
import UserReview from '../../../components/UserReview';
import UIProvider from '../setup/UIProvider';

import {render, screen} from '@testing-library/react-native';
import demoReviews from '../../../controllers/demoReviews.json';

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

    expect(screen.queryByTestId('review-author-' + review._id)).toBeOnTheScreen();
    expect(screen.queryByTestId('review-author-' + review._id)).toHaveTextContent(review.author + " says,");
    expect(screen.queryByTestId('review-description-' + review._id)).toBeOnTheScreen();
    expect(screen.queryByTestId('review-description-' + review._id)).toHaveTextContent(review.description);
  });
});
