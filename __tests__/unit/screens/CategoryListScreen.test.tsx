/**
 * @format
 */

import React from 'react';
import 'react-native';
import {RootContext} from '../../../context/RootContext';
import demoCategories from '../../../controllers/demoCategories.json';
import CategoryListScreen from '../../../screens/CategoryListScreen';
import UIProvider from '../setup/UIProvider';

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import categoryController from '../../../controllers/categoryController';

jest.mock('../../../components/CategoryItem', () => 'CategoryItem');
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    name: 'Categories',
  }),
}));
jest.spyOn(categoryController, 'fetchCategories');

describe('CategoryListScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders correctly', async () => {
    const categoriesList = demoCategories.categories;
    (categoryController.fetchCategories as jest.Mock).mockReturnValue(
      categoriesList,
    );

    const handleError = jest.fn();
    const clearError = jest.fn();

    render(
      <UIProvider>
        <RootContext.Provider
          value={
            {
              handleError,
              clearError,
            } as any
          }>
          <CategoryListScreen />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(categoryController.fetchCategories).toBeCalledTimes(1);
    });

    expect(screen.queryByText('Latest Categories')).toBeOnTheScreen();
    expect(screen.queryAllByTestId('flat-list-item').length).toBe(
      categoriesList.length,
    );
  });
  it('renders no categories correctly', async () => {
    (categoryController.fetchCategories as jest.Mock).mockReturnValue([]);

    const handleError = jest.fn();
    const clearError = jest.fn();

    render(
      <UIProvider>
        <RootContext.Provider
          value={
            {
              handleError,
              clearError,
            } as any
          }>
          <CategoryListScreen />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(categoryController.fetchCategories).toBeCalledTimes(1);
    });

    expect(screen.queryByText('No categories found...')).toBeOnTheScreen();
    expect(screen.queryAllByTestId('flat-list-item').length).toBe(0);
  });
  it('loads more categories correctly', async () => {
    const firstResult = Promise.resolve(demoCategories.categories.slice(0, 5));
    const secondResult = Promise.resolve(
      demoCategories.categories.slice(6, 10),
    );

    (categoryController.fetchCategories as jest.Mock)
      .mockReturnValueOnce(firstResult)
      .mockReturnValueOnce(secondResult);

    const handleError = jest.fn();
    const clearError = jest.fn();

    render(
      <UIProvider>
        <RootContext.Provider
          value={
            {
              handleError,
              clearError,
            } as any
          }>
          <CategoryListScreen />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(categoryController.fetchCategories).toBeCalledTimes(1);
      expect(categoryController.fetchCategories).toHaveReturnedWith(
        firstResult,
      );
    });

    expect(screen.queryAllByTestId('flat-list-item').length).toBe(5);

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
      expect(categoryController.fetchCategories).toBeCalledTimes(1);
      expect(categoryController.fetchCategories).toHaveReturnedWith(
        secondResult,
      );
    });
  });
});
