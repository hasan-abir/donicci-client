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
    expect(screen.queryByTestId('email')).toBeOnTheScreen();
    expect(screen.queryByTestId('password')).toBeOnTheScreen();
    expect(screen.queryByTestId('submit-btn')).toBeOnTheScreen();
    expect(screen.queryByTestId('register-btn')).toBeOnTheScreen();
  });
  it('calls navigate to register correctly', async () => {
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

    fireEvent.press(screen.getByTestId('register-btn'));

    expect(navigate).toBeCalledTimes(1);
    expect(navigate).toBeCalledWith('Register');
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
    const button = screen.getByTestId('submit-btn');
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
    fireEvent.press(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(mockedAuthenticateUser).toHaveBeenCalledWith(
        {email, password},
        route.name,
      );
    });

    expect(goBack).toBeCalledTimes(0);
  });
});
