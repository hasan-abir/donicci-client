/**
 * @format
 */

import React from 'react';
import 'react-native';
import CategoryItem from '../../../components/CategoryItem';
import demoCategories from '../../e2e/helpers/demoCategories.json';
import UIProvider from '../setup/UIProvider';

import {fireEvent, render, screen} from '@testing-library/react-native';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockedNavigate,
  }),
}));

describe('CategoryItem', () => {
  it('renders correctly', () => {
    const item = demoCategories.categories[0];

    render(
      <UIProvider>
        <CategoryItem item={item} index={0} />
      </UIProvider>,
    );

    expect(
      screen.queryByTestId('category-title-' + item._id),
    ).toBeOnTheScreen();
  });

  it('navigates correctly', () => {
    const item = demoCategories.categories[0];

    render(
      <UIProvider>
        <CategoryItem item={item} index={0} />
      </UIProvider>,
    );

    fireEvent.press(screen.getByTestId('category-title-' + item._id));

    expect(mockedNavigate).toBeCalledTimes(1);
    expect(mockedNavigate).toBeCalledWith('CategoryProducts', {
      categoryId: item._id,
    });
  });
});
