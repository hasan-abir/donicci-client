/**
 * @format
 */

import React from 'react';
import 'react-native';
import TabHeader from '../../components/TabHeader';
import UIProvider from '../setup/UIProvider';

import {fireEvent, render, screen} from '@testing-library/react-native';
import {RootContext} from '../../context/RootContext';

jest.mock('../../components/SearchForm', () => 'SearchForm');

describe('TabHeader', () => {
  it('renders correctly', () => {
    const navigation = {navigate: jest.fn()};
    const route = {name: 'Home'};

    const props = {
      navigation,
      route,
    };

    render(
      <UIProvider>
        <TabHeader {...(props as any)} />
      </UIProvider>,
    );
  });

  it('login button works correctly', () => {
    const navigation = {navigate: jest.fn()};
    const route = {name: 'Search'};

    const props = {
      navigation,
      route,
    };

    render(
      <UIProvider>
        <TabHeader {...(props as any)} />
      </UIProvider>,
    );

    fireEvent.press(screen.getByTestId('login-btn'));

    expect(navigation.navigate).toBeCalledTimes(1);
    expect(navigation.navigate).toBeCalledWith('Login');
  });

  it('logout button works correctly', () => {
    const navigation = {navigate: jest.fn()};
    const route = {name: 'Search'};
    const logOutUser = jest.fn();

    const props = {
      navigation,
      route,
    };

    render(
      <UIProvider>
        <RootContext.Provider
          value={{user: {username: 'Hasan Abir'}, logOutUser} as any}>
          <TabHeader {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    fireEvent.press(screen.getByTestId('logout-btn'));

    expect(logOutUser).toBeCalledTimes(1);
  });

  it('error shows correctly', () => {
    const navigation = {navigate: jest.fn()};
    const route = {name: 'Home'};

    const props = {
      navigation,
      route,
    };

    const errorMsg = 'Error message';

    render(
      <UIProvider>
        <RootContext.Provider
          value={{error: {name: route.name, msg: errorMsg}} as any}>
          <TabHeader {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    expect(screen.queryByText(errorMsg)).toBeOnTheScreen();
  });
});
