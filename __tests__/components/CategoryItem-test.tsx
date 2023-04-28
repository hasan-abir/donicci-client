/**
 * @format
 */

import React from 'react';
import 'react-native';
import CategoryItem from '../../components/CategoryItem';
import demoCategories from '../../controllers/demoCategories.json';
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
        <CategoryItem item={item} />
      </UIProvider>,
    );

    expect(screen.queryByText(item.name)).toBeOnTheScreen();
  });

  it('navigates correctly', () => {
    const item = demoCategories.categories[0];

    render(
      <UIProvider>
        <CategoryItem item={item} />
      </UIProvider>,
    );

    fireEvent.press(screen.getByText(item.name));

    expect(mockedNavigate).toBeCalledTimes(1);
    expect(mockedNavigate).toBeCalledWith('CategoryProducts', {
      categoryId: item._id,
    });
  });
});
