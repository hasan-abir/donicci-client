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

    expect(
      screen.queryByTestId('product-image-' + product._id),
    ).toBeOnTheScreen();
    expect(
      screen.queryByTestId('product-title-' + product._id),
    ).toBeOnTheScreen();
    expect(
      screen.queryByTestId('product-title-' + product._id),
    ).toHaveTextContent(product.title);
    expect(
      screen.queryByTestId('product-price-' + product._id),
    ).toBeOnTheScreen();
    expect(
      screen.queryByTestId('product-price-' + product._id),
    ).toHaveTextContent('$' + product.price);
    expect(
      screen.queryByTestId('product-rating-' + product._id),
    ).toBeOnTheScreen();
    expect(
      screen.queryByTestId('product-rating-' + product._id),
    ).toHaveTextContent(product.user_rating.toString());
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
