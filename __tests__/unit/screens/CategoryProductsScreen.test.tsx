/**
 * @format
 */

import React from 'react';
import 'react-native';
import {RootContext} from '../../../context/RootContext';
import demoCategories from '../../e2e/helpers/demoCategories.json';
import CategoryProductsScreen from '../../../screens/CategoryProductsScreen';
import UIProvider from '../setup/UIProvider';

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import categoryController from '../../../controllers/categoryController';

jest.mock('../../../components/ProductList', () => 'ProductList');
jest.spyOn(categoryController, 'fetchSingleCategory');

describe('CategoryProductsScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders correctly', async () => {
    const category = demoCategories.categories[0];
    (categoryController.fetchSingleCategory as jest.Mock).mockReturnValue(
      category,
    );
    const navigation = {
      setOptions: jest.fn(),
      navigate: jest.fn(),
    };
    const route = {
      name: 'CategoryProducts',
      params: {categoryId: category._id},
    };
    const props = {
      navigation,
      route,
    };
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
          <CategoryProductsScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(categoryController.fetchSingleCategory).toBeCalledTimes(1);
      expect(categoryController.fetchSingleCategory).toBeCalledWith(
        category._id,
      );
      expect(navigation.setOptions).toBeCalledTimes(1);
      expect(navigation.setOptions).toBeCalledWith({title: category.name});
    });

    expect(screen.queryByText('Category not found')).not.toBeOnTheScreen();
  });
  it('when no category navigates correctly', async () => {
    (categoryController.fetchSingleCategory as jest.Mock).mockReturnValue(null);
    const navigation = {
      setOptions: jest.fn(),
      navigate: jest.fn(),
    };
    const route = {
      name: 'CategoryProducts',
      params: {categoryId: '123'},
    };
    const props = {
      navigation,
      route,
    };
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
          <CategoryProductsScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(categoryController.fetchSingleCategory).toBeCalledTimes(1);
      expect(categoryController.fetchSingleCategory).toBeCalledWith('123');
    });

    expect(screen.queryByText('Category not found')).toBeOnTheScreen();

    fireEvent.press(screen.getByText('BACK TO CATEGORIES'));

    expect(navigation.navigate).toBeCalledTimes(1);
    expect(navigation.navigate).toBeCalledWith('Categories');
  });
});
