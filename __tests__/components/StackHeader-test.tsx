/**
 * @format
 */

import React from 'react';
import 'react-native';
import StackHeader from '../../components/StackHeader';
import UIProvider from '../setup/UIProvider';

import {fireEvent, render, screen} from '@testing-library/react-native';
import {RootContext} from '../../context/RootContext';

jest.mock('../../components/SearchForm', () => 'SearchForm');

describe('StackHeader', () => {
  it('renders correctly', () => {
    const navigation = {canGoBack: jest.fn()};
    const options = {title: 'Lorem'};
    const route = {name: 'Home'};

    const props = {
      navigation,
      options,
      route,
    };

    render(
      <UIProvider>
        <StackHeader {...(props as any)} />
      </UIProvider>,
    );

    expect(screen.queryByText(options.title)).toBeOnTheScreen();
  });

  it('renders SearchForm correctly', () => {
    const navigation = {canGoBack: jest.fn()};
    const options = {title: 'Lorem'};
    const route = {name: 'Search'};

    const props = {
      navigation,
      options,
      route,
    };

    render(
      <UIProvider>
        <StackHeader {...(props as any)} />
      </UIProvider>,
    );

    expect(screen.queryByText(options.title)).not.toBeOnTheScreen();
  });

  it('back button works correctly', () => {
    const navigation = {canGoBack: jest.fn(() => true), goBack: jest.fn()};
    const options = {title: 'Lorem'};
    const route = {name: 'Search'};

    const props = {
      navigation,
      options,
      route,
    };

    render(
      <UIProvider>
        <StackHeader {...(props as any)} />
      </UIProvider>,
    );

    fireEvent.press(screen.getByTestId('back-btn'));

    expect(navigation.goBack).toBeCalledTimes(1);
  });

  it('error shows correctly', () => {
    const navigation = {navigate: jest.fn()};
    const options = {title: 'Lorem'};
    const route = {name: 'Search'};

    const props = {
      navigation,
      options,
      route,
    };

    const errorMsg = 'Error message';

    render(
      <UIProvider>
        <RootContext.Provider
          value={{error: {name: route.name, msg: errorMsg}} as any}>
          <StackHeader {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    expect(screen.queryByText(errorMsg)).toBeOnTheScreen();
  });
});
