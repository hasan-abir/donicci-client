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
  it('submits form correctly', async () => {
    const navigate = jest.fn();
    const route = {name: 'Register'};
    const authenticateUser = jest.fn().mockResolvedValue(true);

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

    const display_name = 'Test Test';
    fireEvent.changeText(screen.getByTestId('display_name'), display_name);
    const username = 'test_1999';
    fireEvent.changeText(screen.getByTestId('username'), username);
    const email = 'test@test.com';
    fireEvent.changeText(screen.getByTestId('email'), email);
    const password = 'testtest';
    fireEvent.changeText(screen.getByTestId('password'), password);
    const button = screen.getByText('REGISTER');
    fireEvent.press(button);

    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(authenticateUser).toBeCalledWith(
        {display_name, username, email, password},
        route.name,
      );
    });

    expect(button).not.toBeDisabled();

    expect(navigate).toBeCalledTimes(1);
    expect(navigate).toBeCalledWith('Home');
  });
  it("doesn't navigate when authentication fails", async () => {
    const navigate = jest.fn();
    const route = {name: 'Register'};
    const authenticateUser = jest.fn().mockResolvedValue(false);

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

    const display_name = 'Test Test';
    fireEvent.changeText(screen.getByTestId('display_name'), display_name);
    const username = 'test_1999';
    fireEvent.changeText(screen.getByTestId('username'), username);
    const email = 'test@test.com';
    fireEvent.changeText(screen.getByTestId('email'), email);
    const password = 'testtest';
    fireEvent.changeText(screen.getByTestId('password'), password);
    fireEvent.press(screen.getByText('REGISTER'));

    await waitFor(() => {
      expect(authenticateUser).toBeCalledWith(
        {display_name, username, email, password},
        route.name,
      );
    });

    expect(navigate).toBeCalledTimes(0);
  });
});
