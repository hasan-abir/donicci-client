/**
 * @format
 */

import React from 'react';
import 'react-native';
import LoginScreen from '../../../screens/LoginScreen';
import UIProvider from '../setup/UIProvider';

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {RootContext} from '../../../context/RootContext';

jest.mock('../../../components/ProductList', () => 'ProductList');

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

    expect(screen.queryAllByText('Login').length).toBe(1);
    expect(screen.queryAllByText('LOGIN').length).toBe(1);
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
  it('submits form correctly', async () => {
    const mockedAuthenticateUser = jest.fn().mockResolvedValueOnce(true);

    const canGoBack = jest.fn(() => true);
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
        <RootContext.Provider
          value={{authenticateUser: mockedAuthenticateUser} as any}>
          <LoginScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    const email = 'test@test.com';
    fireEvent.changeText(screen.getByTestId('email'), email);
    const password = 'testtest';
    fireEvent.changeText(screen.getByTestId('password'), password);
    const button = screen.getByText('LOGIN');
    fireEvent.press(button);

    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(mockedAuthenticateUser).toHaveBeenCalledWith(
        {email, password},
        route.name,
      );
    });

    expect(button).not.toBeDisabled();

    expect(goBack).toBeCalledTimes(1);
  });
  it("doesn't go back if authentication fails", async () => {
    const mockedAuthenticateUser = jest.fn().mockResolvedValueOnce(false);

    const canGoBack = jest.fn(() => true);
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
        <RootContext.Provider
          value={{authenticateUser: mockedAuthenticateUser} as any}>
          <LoginScreen {...(props as any)} />
        </RootContext.Provider>
      </UIProvider>,
    );

    const email = 'test@test.com';
    fireEvent.changeText(screen.getByTestId('email'), email);
    const password = 'testtest';
    fireEvent.changeText(screen.getByTestId('password'), password);
    fireEvent.press(screen.getByText('LOGIN'));

    await waitFor(() => {
      expect(mockedAuthenticateUser).toHaveBeenCalledWith(
        {email, password},
        route.name,
      );
    });

    expect(goBack).toBeCalledTimes(0);
  });
});
