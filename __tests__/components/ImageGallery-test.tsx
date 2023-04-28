/**
 * @format
 */

import React from 'react';
import 'react-native';
import ImageGallery from '../../components/ImageGallery';
import demoProducts from '../../controllers/demoProducts.json';
import UIProvider from '../setup/UIProvider';

import {fireEvent, render, screen} from '@testing-library/react-native';

describe('ImageGallery', () => {
  it('renders correctly', () => {
    const product = {...demoProducts.products[0]};

    render(
      <UIProvider>
        <ImageGallery images={product.images} alt={product.title} />
      </UIProvider>,
    );
  });

  it('switch image correctly', () => {
    const product = {...demoProducts.products[0]};

    render(
      <UIProvider>
        <ImageGallery images={product.images} alt={product.title} />
      </UIProvider>,
    );

    fireEvent.press(screen.getByTestId('gallery-image-2'));

    expect(screen.getByTestId('gallery-image-main').props.source.uri).toBe(
      product.images[1].url,
    );
  });
});
