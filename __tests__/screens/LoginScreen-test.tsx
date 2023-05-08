/**
 * @format
 */

import React from 'react';
import 'react-native';
import LoginScreen from '../../screens/LoginScreen';
import UIProvider from '../setup/UIProvider';

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {RootContext} from '../../context/RootContext';

jest.mock('../../components/ProductList', () => 'ProductList');

describe('LoginScreen', () => {
  it('renders correctly', async () => {
    const canGoBack = jest.fn();
    const goBack = jest.fn();
    const navigate = jest.fn();
    const route = {name: 'Login'};

    const props = {
      navigation: {
        canGoBack,
        goBack,
        navigate,
      },
      route,
    };

    render(
      <UIProvider>
        <LoginScreen {...(props as any)} />
      </UIProvider>,
    );

    expect(screen.queryAllByText('Login').length).toBe(2);
    expect(screen.queryByText('Email')).toBeOnTheScreen();
    expect(screen.queryByText('Password')).toBeOnTheScreen();
    expect(screen.queryByText('Register')).toBeOnTheScreen();
    expect(
      screen.queryByText(", if you don't have an account"),
    ).toBeOnTheScreen();
  });
  it('navigates to register correctly', async () => {
    const canGoBack = jest.fn();
    const goBack = jest.fn();
    const navigate = jest.fn();
    const route = {name: 'Login'};

    const props = {
      navigation: {
        canGoBack,
        goBack,
        navigate,
      },
      route,
    };

    render(
      <UIProvider>
        <LoginScreen {...(props as any)} />
      </UIProvider>,
    );

    fireEvent.press(screen.getByText('Register'));

    expect(navigate).toBeCalledTimes(1);
  });
  it('for all empty fields, shows error correctly', async () => {
    const canGoBack = jest.fn();
    const goBack = jest.fn();
    const navigate = jest.fn();
    const route = {name: 'Login'};
    const authenticateUser = jest.fn();

    const props = {
      navigation: {
        canGoBack,
        goBack,
        navigate,
      },
      route,
    };

    render(
      <UIProvider>
        <RootContext.Provider value={{authenticateUser} as any}>
          <LoginScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    fireEvent.press(screen.getAllByText('Login')[1]);

    expect(screen.queryByText('Email is required')).toBeOnTheScreen();
    expect(authenticateUser).toBeCalledTimes(0);
  });
  it('for invalid email field, shows error correctly', async () => {
    const canGoBack = jest.fn();
    const goBack = jest.fn();
    const navigate = jest.fn();
    const route = {name: 'Login'};
    const authenticateUser = jest.fn();

    const props = {
      navigation: {
        canGoBack,
        goBack,
        navigate,
      },
      route,
    };

    render(
      <UIProvider>
        <RootContext.Provider value={{authenticateUser} as any}>
          <LoginScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    fireEvent.changeText(screen.getByTestId('email'), 'testtest.com');
    fireEvent.press(screen.getAllByText('Login')[1]);

    expect(screen.queryByText('Email is not valid')).toBeOnTheScreen();
    expect(authenticateUser).toBeCalledTimes(0);
  });
  it('for empty password field, shows error correctly', async () => {
    const canGoBack = jest.fn();
    const goBack = jest.fn();
    const navigate = jest.fn();
    const route = {name: 'Login'};
    const authenticateUser = jest.fn();

    const props = {
      navigation: {
        canGoBack,
        goBack,
        navigate,
      },
      route,
    };

    render(
      <UIProvider>
        <RootContext.Provider value={{authenticateUser} as any}>
          <LoginScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    fireEvent.changeText(screen.getByTestId('email'), 'test@test.com');
    fireEvent.press(screen.getAllByText('Login')[1]);

    expect(screen.queryByText('Password is required')).toBeOnTheScreen();
    expect(authenticateUser).toBeCalledTimes(0);
  });
  it('for short password field, shows error correctly', async () => {
    const canGoBack = jest.fn();
    const goBack = jest.fn();
    const navigate = jest.fn();
    const route = {name: 'Login'};
    const authenticateUser = jest.fn();

    const props = {
      navigation: {
        canGoBack,
        goBack,
        navigate,
      },
      route,
    };

    render(
      <UIProvider>
        <RootContext.Provider value={{authenticateUser} as any}>
          <LoginScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    fireEvent.changeText(screen.getByTestId('email'), 'test@test.com');
    fireEvent.changeText(screen.getByTestId('password'), 'testtes');
    fireEvent.press(screen.getAllByText('Login')[1]);

    expect(screen.queryByText('Password is too short')).toBeOnTheScreen();
    expect(authenticateUser).toBeCalledTimes(0);
  });
  it('submits form correctly', async () => {
    const canGoBack = jest.fn(() => true);
    const goBack = jest.fn();
    const navigate = jest.fn();
    const route = {name: 'Login'};
    const authenticateUser = jest.fn(() => Promise.resolve(true));

    const props = {
      navigation: {
        canGoBack,
        goBack,
        navigate,
      },
      route,
    };

    render(
      <UIProvider>
        <RootContext.Provider value={{authenticateUser} as any}>
          <LoginScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    const email = 'test@test.com';
    fireEvent.changeText(screen.getByTestId('email'), email);
    const password = 'testtest';
    fireEvent.changeText(screen.getByTestId('password'), password);
    fireEvent.press(screen.getAllByText('Login')[1]);

    await waitFor(() => {
      expect(authenticateUser).toBeCalledTimes(1);
      expect(authenticateUser).toBeCalledWith({email, password}, route.name);
    });

    expect(goBack).toBeCalledTimes(1);
  });
});
