/**
 * @format
 */

import React from 'react';
import 'react-native';
import ProductDetails from '../../../components/ProductDetails';
import demoProducts from '../../e2e/helpers/demoProducts.json';
import UIProvider from '../setup/UIProvider';

import {fireEvent, render, screen} from '@testing-library/react-native';
import {Product} from '../../../components/ProductItem';
import {RootContext} from '../../../context/RootContext';

const mockedRoute = {name: 'ProductDetails'};
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    ...mockedRoute,
  }),
}));
jest.mock('../../../components/ImageGallery', () => 'ImageGallery');
jest.mock('../../../components/StarRating', () => 'StarRating');

describe('ProductDetails', () => {
  it('renders correctly', () => {
    const product: Product = demoProducts.products[0];

    render(
      <UIProvider>
        <ProductDetails product={product} />
      </UIProvider>,
    );

    expect(screen.queryByTestId('title')).toBeOnTheScreen();
    expect(screen.queryByTestId('title')).toHaveTextContent(product.title);
    expect(screen.queryByTestId('price')).toBeOnTheScreen();
    expect(screen.queryByTestId('price')).toHaveTextContent(
      '$' + product.price,
    );
    expect(screen.queryByTestId('description')).toBeOnTheScreen();
    expect(screen.queryByTestId('description')).toHaveTextContent(
      product.description || '',
    );
    expect(screen.queryByTestId('decrease-quantity')).toBeOnTheScreen();
    expect(screen.queryByTestId('increase-quantity')).toBeOnTheScreen();
    expect(screen.queryByTestId('quantity')).toBeOnTheScreen();
    expect(screen.queryByTestId('quantity')).toHaveTextContent(
      '1 of ' + product.quantity,
    );

    if (product.categories_list) {
      for (let i = 0; i < product.categories_list?.length; i++) {
        expect(
          screen.queryByTestId('category-' + product.categories_list[i]._id),
        ).toBeOnTheScreen();
        expect(
          screen.queryByTestId('category-' + product.categories_list[i]._id),
        ).toHaveTextContent(product.categories_list[i].name);
      }
    }
  });
  it('renders out of stock correctly', () => {
    const product: Product = demoProducts.products[2];

    render(
      <UIProvider>
        <ProductDetails product={product} />
      </UIProvider>,
    );

    expect(screen.queryByTestId('out-of-stock')).toBeOnTheScreen();
  });
  it('increase quantity correctly', () => {
    const product: Product = demoProducts.products[0];

    render(
      <UIProvider>
        <ProductDetails product={product} />
      </UIProvider>,
    );

    fireEvent.press(screen.getByTestId('increase-quantity'));

    expect(screen.queryByTestId('quantity')).toBeOnTheScreen();
    expect(screen.queryByTestId('quantity')).toHaveTextContent(
      '2 of ' + product.quantity,
    );
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

    expect(screen.queryByTestId('quantity')).toBeOnTheScreen();
    expect(screen.queryByTestId('quantity')).toHaveTextContent(
      '2 of ' + product.quantity,
    );
  });

  it('avoids decreasing quantity below 1', () => {
    const product: Product = demoProducts.products[0];

    render(
      <UIProvider>
        <ProductDetails product={product} />
      </UIProvider>,
    );

    fireEvent.press(screen.getByTestId('decrease-quantity'));

    expect(screen.queryByTestId('quantity')).toBeOnTheScreen();
    expect(screen.queryByTestId('quantity')).toHaveTextContent(
      '1 of ' + product.quantity,
    );
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

    fireEvent.press(screen.getByTestId('add-to-cart'));

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

    fireEvent.press(screen.getByTestId('remove-from-cart'));

    expect(removeItemFromCart).toBeCalledTimes(1);
    expect(removeItemFromCart).toBeCalledWith('1', mockedRoute.name);
  });
});
