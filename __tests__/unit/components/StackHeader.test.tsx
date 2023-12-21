/**
 * @format
 */

import React from 'react';
import 'react-native';
import StackHeader from '../../../components/StackHeader';
import UIProvider from '../setup/UIProvider';

import {fireEvent, render, screen} from '@testing-library/react-native';
import {RootContext} from '../../../context/RootContext';

jest.mock('../../../components/SearchForm', () => 'SearchForm');

describe('StackHeader', () => {
  it('renders correctly when not in bottom tabs AND not in search', () => {
    const navigation = {canGoBack: jest.fn()};
    const options = {title: 'Lorem'};
    const route = {name: 'Login'};

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
    expect(screen.queryByTestId('back-btn')).toBeOnTheScreen();
    expect(screen.queryByTestId('search-box')).not.toBeOnTheScreen();
    expect(screen.queryByTestId('logout-btn')).not.toBeOnTheScreen();
    expect(screen.queryByTestId('login-btn')).not.toBeOnTheScreen();
  });

  it('renders correctly when in bottom tabs AND authorized', () => {
    const navigation = {canGoBack: jest.fn()};
    const options = {title: 'Lorem'};
    const route = {name: 'Home'};

    const props = {
      navigation,
      options,
      route,
    };

    render(
      <RootContext.Provider value={{user: {username: 'Hasan'}} as any}>
        <UIProvider>
          <StackHeader {...(props as any)} />
        </UIProvider>
      </RootContext.Provider>,
    );

    expect(screen.queryByText(options.title)).not.toBeOnTheScreen();
    expect(screen.queryByTestId('back-btn')).not.toBeOnTheScreen();
    expect(screen.queryByTestId('search-box')).toBeOnTheScreen();
    expect(screen.queryByTestId('logout-btn')).toBeOnTheScreen();
    expect(screen.queryByTestId('login-btn')).not.toBeOnTheScreen();
  });

  it('renders correctly when in bottom tabs AND not authorized', () => {
    const navigation = {canGoBack: jest.fn()};
    const options = {title: 'Lorem'};
    const route = {name: 'Home'};

    const props = {
      navigation,
      options,
      route,
    };

    render(
      <RootContext.Provider value={{user: null} as any}>
        <UIProvider>
          <StackHeader {...(props as any)} />
        </UIProvider>
      </RootContext.Provider>,
    );

    expect(screen.queryByText(options.title)).not.toBeOnTheScreen();
    expect(screen.queryByTestId('back-btn')).not.toBeOnTheScreen();
    expect(screen.queryByTestId('search-box')).toBeOnTheScreen();
    expect(screen.queryByTestId('logout-btn')).not.toBeOnTheScreen();
    expect(screen.queryByTestId('login-btn')).toBeOnTheScreen();
  });

  it('renders correctly when in search', () => {
    const navigation = {canGoBack: jest.fn()};
    const options = {title: 'Lorem'};
    const route = {name: 'Search'};

    const props = {
      navigation,
      options,
      route,
    };

    render(
      <RootContext.Provider value={{user: null} as any}>
        <UIProvider>
          <StackHeader {...(props as any)} />
        </UIProvider>
      </RootContext.Provider>,
    );

    expect(screen.queryByText(options.title)).not.toBeOnTheScreen();
    expect(screen.queryByTestId('back-btn')).toBeOnTheScreen();
    expect(screen.queryByTestId('search-box')).toBeOnTheScreen();
    expect(screen.queryByTestId('logout-btn')).not.toBeOnTheScreen();
    expect(screen.queryByTestId('login-btn')).not.toBeOnTheScreen();
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
          value={{error: {name: route.name, msgs: [errorMsg]}} as any}>
          <StackHeader {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    expect(screen.queryByText(errorMsg)).toBeOnTheScreen();
  });
});
