/**
 * @format
 */

import React from 'react';
import 'react-native';
import SearchForm from '../../../components/SearchForm';
import UIProvider from '../setup/UIProvider';

import {fireEvent, render, screen} from '@testing-library/react-native';

const mockedRoute = {name: 'Search'};
const mockedNavigate = jest.fn();
const mockedSetParams = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockedNavigate,
    setParams: mockedSetParams,
  }),
  useRoute: () => ({
    ...mockedRoute,
  }),
}));

describe('SearchForm', () => {
  afterEach(() => {
    mockedRoute.name = 'Search';
  });
  it('renders correctly', () => {
    render(
      <UIProvider>
        <SearchForm />
      </UIProvider>,
    );

    expect(screen.queryByPlaceholderText('Search')).toBeOnTheScreen();
  });

  it('navigates correctly', () => {
    mockedRoute.name = 'Home';

    render(
      <UIProvider>
        <SearchForm />
      </UIProvider>,
    );

    fireEvent.press(screen.getByPlaceholderText('Search'));

    expect(mockedNavigate).toBeCalledTimes(1);
    expect(mockedNavigate).toBeCalledWith('Search', {});
  });
  it('sets navigation params correctly', () => {
    const term = 'Lorem';

    render(
      <UIProvider>
        <SearchForm />
      </UIProvider>,
    );

    fireEvent.changeText(screen.getByPlaceholderText('Search'), term);
    fireEvent(screen.getByPlaceholderText('Search'), 'submitEditing');

    expect(mockedSetParams).toBeCalledTimes(1);
    expect(mockedSetParams).toBeCalledWith({term});
  });
});
