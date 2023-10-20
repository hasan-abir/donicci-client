/**
 * @format
 */

import React from 'react';
import 'react-native';
import ProductItem from '../../../components/ProductItem';
import demoProducts from '../../e2e/helpers/demoProducts.json';
import UIProvider from '../setup/UIProvider';

import {fireEvent, render, screen} from '@testing-library/react-native';
import {Product} from '../../../components/ProductItem';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockedNavigate,
  }),
}));

describe('ProductItem', () => {
  it('renders correctly', () => {
    const product: Product = demoProducts.products[0];

    render(
      <UIProvider>
        <ProductItem item={product} />
      </UIProvider>,
    );

    expect(screen.queryByText(product.title)).toBeOnTheScreen();
    expect(screen.queryByText('$' + product.price)).toBeOnTheScreen();
  });

  it('navigates to ProductDetails correctly', () => {
    const product: Product = demoProducts.products[0];

    render(
      <UIProvider>
        <ProductItem item={product} />
      </UIProvider>,
    );

    fireEvent.press(screen.getByTestId('card'));

    expect(mockedNavigate).toBeCalledTimes(1);
    expect(mockedNavigate).toBeCalledWith('ProductDetails', {
      productId: product._id,
    });
  });
});
