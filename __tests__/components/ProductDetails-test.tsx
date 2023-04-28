/**
 * @format
 */

import React from 'react';
import 'react-native';
import ProductDetails from '../../components/ProductDetails';
import demoProducts from '../../controllers/demoProducts.json';
import UIProvider from '../setup/UIProvider';

import {fireEvent, render, screen} from '@testing-library/react-native';
import {Product} from '../../components/ProductItem';
import {RootContext} from '../../context/RootContext';

const mockedRoute = {name: 'ProductDetails'};
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    ...mockedRoute,
  }),
}));
jest.mock('../../components/ImageGallery', () => 'ImageGallery');
jest.mock('../../components/StarRating', () => 'StarRating');

describe('ProductDetails', () => {
  it('renders correctly', () => {
    const product: Product = demoProducts.products[0];

    render(
      <UIProvider>
        <ProductDetails product={product} />
      </UIProvider>,
    );

    expect(screen.queryByText(product.title)).toBeOnTheScreen();
    expect(screen.queryByText(product.description || '')).toBeOnTheScreen();
    expect(screen.queryByText('Price - $' + product.price)).toBeOnTheScreen();
    expect(screen.queryByText('1 / ' + product.quantity)).toBeOnTheScreen();
    expect(
      screen.queryByText(product.categories_list[0].name),
    ).toBeOnTheScreen();
    expect(
      screen.queryByText(product.categories_list[1].name),
    ).toBeOnTheScreen();
  });
  it('renders out of stock correctly', () => {
    const product: Product = demoProducts.products[2];

    render(
      <UIProvider>
        <ProductDetails product={product} />
      </UIProvider>,
    );

    expect(screen.queryByText('Out of stock')).toBeOnTheScreen();
  });
  it('increase quantity correctly', () => {
    const product: Product = demoProducts.products[0];

    render(
      <UIProvider>
        <ProductDetails product={product} />
      </UIProvider>,
    );

    fireEvent.press(screen.getByTestId('increase-quantity'));

    expect(screen.queryByText('2 / ' + product.quantity)).toBeOnTheScreen();
  });

  it('decrease quantity correctly', () => {
    const product: Product = demoProducts.products[0];

    render(
      <UIProvider>
        <ProductDetails product={product} />
      </UIProvider>,
    );

    fireEvent.press(screen.getByTestId('increase-quantity'));
    fireEvent.press(screen.getByTestId('increase-quantity'));
    fireEvent.press(screen.getByTestId('decrease-quantity'));

    expect(screen.queryByText('2 / ' + product.quantity)).toBeOnTheScreen();
  });

  it('avoids decreasing quantity below 1', () => {
    const product: Product = demoProducts.products[0];

    render(
      <UIProvider>
        <ProductDetails product={product} />
      </UIProvider>,
    );

    fireEvent.press(screen.getByTestId('decrease-quantity'));

    expect(screen.queryByText('1 / ' + product.quantity)).toBeOnTheScreen();
  });

  it('adds item to cart correctly', () => {
    const product: Product = demoProducts.products[0];
    const inCart = jest.fn(() => false);
    const addItemToCart = jest.fn();

    render(
      <UIProvider>
        <RootContext.Provider value={{addItemToCart, inCart} as any}>
          <ProductDetails product={product} />
        </RootContext.Provider>
      </UIProvider>,
    );

    fireEvent.press(screen.getByText('Add to Cart'));

    expect(addItemToCart).toBeCalledTimes(1);
    expect(addItemToCart).toBeCalledWith(product, 1, mockedRoute.name);
  });

  it('removes item to cart correctly', () => {
    const product: Product = demoProducts.products[0];
    const inCart = jest.fn(() => true);
    const removeItemFromCart = jest.fn();

    render(
      <UIProvider>
        <RootContext.Provider value={{removeItemFromCart, inCart} as any}>
          <ProductDetails product={product} />
        </RootContext.Provider>
      </UIProvider>,
    );

    fireEvent.press(screen.getByText('Remove from Cart'));

    expect(removeItemFromCart).toBeCalledTimes(1);
    expect(removeItemFromCart).toBeCalledWith('1', mockedRoute.name);
  });
});
