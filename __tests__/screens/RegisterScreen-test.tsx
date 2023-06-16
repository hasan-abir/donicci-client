/**
 * @format
 */

import React from 'react';
import 'react-native';
import RegisterScreen from '../../screens/RegisterScreen';
import UIProvider from '../setup/UIProvider';

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {RootContext} from '../../context/RootContext';

jest.mock('../../components/ProductList', () => 'ProductList');

describe('RegisterScreen', () => {
  it('renders correctly', async () => {
    const navigate = jest.fn();
    const route = {name: 'Register'};

    const props = {
      navigation: {
        navigate,
      },
      route,
    };

    render(
      <UIProvider>
        <RegisterScreen {...(props as any)} />
      </UIProvider>,
    );

    expect(screen.queryAllByText('Register').length).toBe(1);
    expect(screen.queryAllByText('REGISTER').length).toBe(1);
    expect(screen.queryByText('Username')).toBeOnTheScreen();
    expect(screen.queryByText('Email')).toBeOnTheScreen();
    expect(screen.queryByText('Password')).toBeOnTheScreen();
    expect(screen.queryByText('Login')).toBeOnTheScreen();
    expect(
      screen.queryByText(', if you already have an account'),
    ).toBeOnTheScreen();
  });
  it('navigates to login correctly', async () => {
    const navigate = jest.fn();
    const route = {name: 'Register'};

    const props = {
      navigation: {
        navigate,
      },
      route,
    };

    render(
      <UIProvider>
        <RegisterScreen {...(props as any)} />
      </UIProvider>,
    );

    fireEvent.press(screen.getByText('Login'));

    expect(navigate).toBeCalledTimes(1);
  });
  it('for all empty fields, shows error correctly', async () => {
    const navigate = jest.fn();
    const route = {name: 'Register'};
    const authenticateUser = jest.fn();

    const props = {
      navigation: {
        navigate,
      },
      route,
    };

    render(
      <UIProvider>
        <RootContext.Provider value={{authenticateUser} as any}>
          <RegisterScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    fireEvent.press(screen.getByText('REGISTER'));

    expect(screen.queryByText('Username is required')).toBeOnTheScreen();
    expect(authenticateUser).toBeCalledTimes(0);
  });
  it('for empty email field, shows error correctly', async () => {
    const navigate = jest.fn();
    const route = {name: 'Register'};
    const authenticateUser = jest.fn();

    const props = {
      navigation: {
        navigate,
      },
      route,
    };

    render(
      <UIProvider>
        <RootContext.Provider value={{authenticateUser} as any}>
          <RegisterScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    fireEvent.changeText(screen.getByTestId('username'), 'Test');
    fireEvent.press(screen.getByText('REGISTER'));

    expect(screen.queryByText('Email is required')).toBeOnTheScreen();
    expect(authenticateUser).toBeCalledTimes(0);
  });
  it('for invalid email field, shows error correctly', async () => {
    const navigate = jest.fn();
    const route = {name: 'Register'};
    const authenticateUser = jest.fn();

    const props = {
      navigation: {
        navigate,
      },
      route,
    };

    render(
      <UIProvider>
        <RootContext.Provider value={{authenticateUser} as any}>
          <RegisterScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    fireEvent.changeText(screen.getByTestId('username'), 'Test');
    fireEvent.changeText(screen.getByTestId('email'), 'testtest.com');
    fireEvent.press(screen.getByText('REGISTER'));

    expect(screen.queryByText('Email is not valid')).toBeOnTheScreen();
    expect(authenticateUser).toBeCalledTimes(0);
  });
  it('for empty password field, shows error correctly', async () => {
    const navigate = jest.fn();
    const route = {name: 'Register'};
    const authenticateUser = jest.fn();

    const props = {
      navigation: {
        navigate,
      },
      route,
    };

    render(
      <UIProvider>
        <RootContext.Provider value={{authenticateUser} as any}>
          <RegisterScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    fireEvent.changeText(screen.getByTestId('username'), 'Test');
    fireEvent.changeText(screen.getByTestId('email'), 'test@test.com');
    fireEvent.press(screen.getByText('REGISTER'));

    expect(screen.queryByText('Password is required')).toBeOnTheScreen();
    expect(authenticateUser).toBeCalledTimes(0);
  });
  it('for short password field, shows error correctly', async () => {
    const navigate = jest.fn();
    const route = {name: 'Register'};
    const authenticateUser = jest.fn();

    const props = {
      navigation: {
        navigate,
      },
      route,
    };

    render(
      <UIProvider>
        <RootContext.Provider value={{authenticateUser} as any}>
          <RegisterScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    fireEvent.changeText(screen.getByTestId('username'), 'Test');
    fireEvent.changeText(screen.getByTestId('email'), 'test@test.com');
    fireEvent.changeText(screen.getByTestId('password'), 'testtes');
    fireEvent.press(screen.getByText('REGISTER'));

    expect(screen.queryByText('Password is too short')).toBeOnTheScreen();
    expect(authenticateUser).toBeCalledTimes(0);
  });
  it('submits form correctly', async () => {
    const navigate = jest.fn();
    const route = {name: 'Register'};
    const authenticateUser = jest.fn(() => Promise.resolve(true));

    const props = {
      navigation: {
        navigate,
      },
      route,
    };

    render(
      <UIProvider>
        <RootContext.Provider value={{authenticateUser} as any}>
          <RegisterScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    const username = 'Test';
    fireEvent.changeText(screen.getByTestId('username'), username);
    const email = 'test@test.com';
    fireEvent.changeText(screen.getByTestId('email'), email);
    const password = 'testtest';
    fireEvent.changeText(screen.getByTestId('password'), password);
    fireEvent.press(screen.getByText('REGISTER'));

    await waitFor(() => {
      expect(authenticateUser).toBeCalledTimes(1);
      expect(authenticateUser).toBeCalledWith(
        {username, email, password},
        route.name,
      );
    });

    expect(navigate).toBeCalledTimes(1);
    expect(navigate).toBeCalledWith('Home');
  });
});
