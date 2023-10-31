/**
 * @format
 */

import React from 'react';
import 'react-native';
import RegisterScreen from '../../../screens/RegisterScreen';
import UIProvider from '../setup/UIProvider';

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {RootContext} from '../../../context/RootContext';

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
    expect(screen.queryByTestId('display_name')).toBeOnTheScreen();
    expect(screen.queryByTestId('username')).toBeOnTheScreen();
    expect(screen.queryByTestId('email')).toBeOnTheScreen();
    expect(screen.queryByTestId('password')).toBeOnTheScreen();
    expect(screen.queryByTestId('submit-btn')).toBeOnTheScreen();
    expect(screen.queryByTestId('login-btn')).toBeOnTheScreen();
  });
  it('calls navigate to login correctly', async () => {
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

    fireEvent.press(screen.getByTestId('login-btn'));

    expect(navigate).toBeCalledTimes(1);
    expect(navigate).toBeCalledWith('Login');
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
    const button = screen.getByTestId('submit-btn');
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
    fireEvent.press(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(authenticateUser).toBeCalledWith(
        {display_name, username, email, password},
        route.name,
      );
    });

    expect(navigate).toBeCalledTimes(0);
  });
});
