/**
 * @format
 */
import React from 'react';
import 'react-native';
import PostReview from '../../../components/PostReview';
import UIProvider from '../setup/UIProvider';

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {RootContext} from '../../../context/RootContext';

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockedNavigate,
  }),
}));

describe('PostReview', () => {
  it('renders correctly', () => {
    const postReview = jest.fn(() => Promise.resolve());

    render(
      <UIProvider>
        <PostReview postReview={postReview} />
      </UIProvider>,
    );
  });

  it('posts review correctly', async () => {
    const postReview = jest.fn(() => Promise.resolve());

    render(
      <UIProvider>
        <RootContext.Provider value={{} as any}>
          <PostReview postReview={postReview} />
        </RootContext.Provider>
      </UIProvider>,
    );

    const description = 'Lorem';

    fireEvent.changeText(
      screen.getByPlaceholderText('Review description...'),
      description,
    );
    fireEvent.press(screen.getByText('SUBMIT'));

    await waitFor(() => {
      expect(postReview).toBeCalledTimes(1);
      expect(postReview).toBeCalledWith(description);
    });
  });

  it('shows error correctly', () => {
    const postReview = jest.fn(() => Promise.resolve());

    render(
      <UIProvider>
        <PostReview postReview={postReview} />
      </UIProvider>,
    );

    fireEvent.press(screen.getByText('SUBMIT'));

    expect(screen.queryByText('Description is required')).toBeOnTheScreen();
  });
});
