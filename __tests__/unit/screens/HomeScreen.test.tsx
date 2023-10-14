/**
 * @format
 */

import React from 'react';
import 'react-native';
import HomeScreen from '../../../screens/HomeScreen';
import UIProvider from '../setup/UIProvider';

import {render} from '@testing-library/react-native';

jest.mock('../../../components/ProductList', () => 'ProductList');

describe('HomeScreen', () => {
  it('renders correctly', async () => {
    render(
      <UIProvider>
        <HomeScreen />
      </UIProvider>,
    );
  });
});
