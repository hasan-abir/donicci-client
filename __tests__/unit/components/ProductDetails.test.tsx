/**
 * @format
 */

import React from 'react';
import 'react-native';
import ProductDetails from '../../../components/ProductDetails';
import demoProducts from '../../e2e/helpers/demoProducts.json';
import UIProvider from '../setup/UIProvider';

import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from '@testing-library/react-native';
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
  it('renders correctly', async () => {
    const product: Product = demoProducts.products[0];
    const inCart = jest.fn(() => Promise.resolve(false));

    render(
      <RootContext.Provider value={{inCart} as any}>
        <UIProvider>
          <ProductDetails product={product} />
        </UIProvider>
      </RootContext.Provider>,
    );

    const addToCartBtn = screen.getByTestId('add-to-cart');

    expect(addToCartBtn).toBeDisabled();

    await waitFor(() => {
      expect(inCart).toBeCalledWith(product._id);
    });

    expect(addToCartBtn).toBeOnTheScreen();
    expect(addToCartBtn).not.toBeDisabled();

    expect(screen.queryByTestId('title')).toBeOnTheScreen();
    expect(screen.queryByTestId('title')).toHaveTextContent(product.title);
    expect(screen.queryByTestId('price')).toBeOnTheScreen();
    expect(screen.queryByTestId('price')).toHaveTextContent(
      '$' + (product.price / 100),
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
  it('renders out of stock correctly', async () => {
    const product: Product = demoProducts.products[3];
    const inCart = jest.fn(() => Promise.resolve(false));

    render(
      <RootContext.Provider value={{inCart} as any}>
        <UIProvider>
          <ProductDetails product={product} />
        </UIProvider>
      </RootContext.Provider>,
    );

    await waitFor(() => {
      expect(inCart).toBeCalledWith(product._id);
    });

    expect(screen.queryByTestId('out-of-stock')).toBeOnTheScreen();
  });
  it('increase quantity correctly', async () => {
    const product: Product = demoProducts.products[0];
    const inCart = jest.fn(() => Promise.resolve(false));

    render(
      <RootContext.Provider value={{inCart} as any}>
        <UIProvider>
          <ProductDetails product={product} />
        </UIProvider>
      </RootContext.Provider>,
    );

    const addToCartBtn = screen.getByTestId('add-to-cart');

    expect(addToCartBtn).toBeDisabled();

    await waitFor(() => {
      expect(inCart).toBeCalledWith(product._id);
    });

    expect(addToCartBtn).toBeOnTheScreen();
    expect(addToCartBtn).not.toBeDisabled();

    fireEvent.press(screen.getByTestId('increase-quantity'));

    expect(screen.queryByTestId('quantity')).toBeOnTheScreen();
    expect(screen.queryByTestId('quantity')).toHaveTextContent(
      '2 of ' + product.quantity,
    );
  });

  it('decrease quantity correctly', async () => {
    const product: Product = demoProducts.products[0];
    const inCart = jest.fn(() => Promise.resolve(false));

    render(
      <RootContext.Provider value={{inCart} as any}>
        <UIProvider>
          <ProductDetails product={product} />
        </UIProvider>
      </RootContext.Provider>,
    );

    const addToCartBtn = screen.getByTestId('add-to-cart');

    expect(addToCartBtn).toBeDisabled();

    await waitFor(() => {
      expect(inCart).toBeCalledWith(product._id);
    });

    expect(addToCartBtn).toBeOnTheScreen();
    expect(addToCartBtn).not.toBeDisabled();

    fireEvent.press(screen.getByTestId('increase-quantity'));
    fireEvent.press(screen.getByTestId('increase-quantity'));
    fireEvent.press(screen.getByTestId('decrease-quantity'));

    expect(screen.queryByTestId('quantity')).toBeOnTheScreen();
    expect(screen.queryByTestId('quantity')).toHaveTextContent(
      '2 of ' + product.quantity,
    );
  });

  it('avoids decreasing quantity below 1', async () => {
    const product: Product = demoProducts.products[0];
    const inCart = jest.fn(() => Promise.resolve(false));

    render(
      <RootContext.Provider value={{inCart} as any}>
        <UIProvider>
          <ProductDetails product={product} />
        </UIProvider>
      </RootContext.Provider>,
    );

    const addToCartBtn = screen.getByTestId('add-to-cart');

    expect(addToCartBtn).toBeDisabled();

    await waitFor(() => {
      expect(inCart).toBeCalledWith(product._id);
    });

    expect(addToCartBtn).toBeOnTheScreen();
    expect(addToCartBtn).not.toBeDisabled();

    fireEvent.press(screen.getByTestId('decrease-quantity'));

    expect(screen.queryByTestId('quantity')).toBeOnTheScreen();
    expect(screen.queryByTestId('quantity')).toHaveTextContent(
      '1 of ' + product.quantity,
    );
  });

  it('adds item to cart correctly', async () => {
    const product: Product = demoProducts.products[0];
    const inCart = jest.fn(() => Promise.resolve(false));
    const addItemToCart = jest.fn(() => Promise.resolve(null));

    render(
      <UIProvider>
        <RootContext.Provider
          value={{addItemToCart, inCart, cartItems: []} as any}>
          <ProductDetails product={product} />
        </RootContext.Provider>
      </UIProvider>,
    );

    const addToCartBtn = screen.getByTestId('add-to-cart');

    expect(addToCartBtn).toBeDisabled();

    await waitFor(() => {
      expect(inCart).toBeCalledWith(product._id);
    });

    expect(addToCartBtn).toBeOnTheScreen();
    expect(addToCartBtn).not.toBeDisabled();

    await act(() => {
      fireEvent.press(addToCartBtn);
    });

    await waitFor(() => {
      expect(addItemToCart).toBeCalledTimes(1);
      expect(addItemToCart).toBeCalledWith(product, 1, mockedRoute.name);

      expect(inCart).toHaveBeenCalled();
    });
  });

  it('removes item from cart correctly', async () => {
    const product: Product = demoProducts.products[0];
    const inCart = jest.fn(() => Promise.resolve(true));
    const removeItemFromCart = jest.fn(() => Promise.resolve(null));

    render(
      <UIProvider>
        <RootContext.Provider value={{removeItemFromCart, inCart} as any}>
          <ProductDetails product={product} />
        </RootContext.Provider>
      </UIProvider>,
    );

    await waitFor(() => {
      expect(inCart).toBeCalledWith(product._id);
    });

    const removeCartItem = screen.getByTestId('remove-from-cart');

    expect(removeCartItem).toBeOnTheScreen();
    expect(removeCartItem).not.toBeDisabled();

    await act(() => {
      fireEvent.press(removeCartItem);
    });

    await waitFor(() => {
      expect(removeItemFromCart).toBeCalledTimes(1);
      expect(removeItemFromCart).toBeCalledWith(product._id, mockedRoute.name);

      expect(inCart).toHaveBeenCalled();
    });
  });
});
