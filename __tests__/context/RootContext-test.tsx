/**
 * @format
 */

import axios from 'axios';
import React, {useContext, useEffect} from 'react';
import 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {render, screen, waitFor} from '@testing-library/react-native';
import {Text, View} from 'react-native';
import RootContextProvider, {RootContext} from '../../context/RootContext';
import type {LoginInput, RegisterInput} from '../../controllers/userController';

jest.mock('axios');

interface TestComponentProps {
  input: LoginInput | RegisterInput;
  screen: string;
}

const TestComponent = ({input, screen}: TestComponentProps) => {
  const {authenticateUser, user, token, error} = useContext(RootContext);

  const initialRequest = async () => {
    await authenticateUser(input, screen);
  };

  useEffect(() => {
    initialRequest();
  }, []);

  return (
    <View>
      <Text>{user?.username}</Text>
      <Text>{token}</Text>
      {error?.msgs.map((msg, index) => {
        return <Text key={index}>{msg}</Text>;
      })}
    </View>
  );
};

describe('RootContext', () => {
  describe('authenticateUser', () => {
    it('stores user and token when login', async () => {
      const input = {
        email: 'hasan@test.com',
        password: 'testtest',
      };

      const response = {
        data: {
          access_token: '123',
          refresh_token: '456',
        },
      };

      (axios.post as jest.Mock).mockResolvedValue(response);

      render(
        <RootContextProvider>
          <TestComponent input={input} screen="Login" />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(axios.post).toBeCalledWith('/auth/login', input);
        expect(AsyncStorage.setItem).toBeCalledWith(
          '@user_token',
          response.data.access_token,
        );
      });

      expect(screen.getByText(response.data.access_token)).toBeVisible();
      expect(screen.getByText('Hasan Abir')).toBeVisible();
    });

    it('stores user and token when register', async () => {
      const input = {
        display_name: 'Hasan Abir',
        username: 'hasan_abir1999',
        email: 'hasan@test.com',
        password: 'testtest',
      };

      const response = {
        data: {
          access_token: '123',
          refresh_token: '456',
        },
      };

      (axios.post as jest.Mock).mockResolvedValue(response);

      render(
        <RootContextProvider>
          <TestComponent input={input} screen="Register" />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(axios.post).toBeCalledWith('/auth/register', {user: input});
        expect(AsyncStorage.setItem).toBeCalledWith(
          '@user_token',
          response.data.access_token,
        );
      });

      expect(screen.getByText(response.data.access_token)).toBeVisible();
      expect(screen.getByText('Hasan Abir')).toBeVisible();
    });

    it('stores a single error message', async () => {
      const input = {
        email: 'hasan@test.com',
        password: 'testtest',
      };

      const error: any = new Error();

      error.response = {
        status: 400,
        data: {msg: 'This is wrong'},
      };

      (axios.post as jest.Mock).mockRejectedValue(error);

      render(
        <RootContextProvider>
          <TestComponent input={input} screen="Login" />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(axios.post).toBeCalledWith('/auth/login', input);

        expect(screen.getByText(error.response.data.msg)).toBeVisible();
      });
    });

    it('stores the default error message', async () => {
      const input = {
        email: 'hasan@test.com',
        password: 'testtest',
      };

      const error: any = new Error();

      error.response = {
        status: 500,
        data: {},
      };

      (axios.post as jest.Mock).mockRejectedValue(error);

      render(
        <RootContextProvider>
          <TestComponent input={input} screen="Login" />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(axios.post).toBeCalledWith('/auth/login', input);

        expect(
          screen.getByText('Something went wrong, try refreshing'),
        ).toBeVisible();
      });
    });

    it('stores error messages', async () => {
      const input = {
        email: 'hasan@test.com',
        password: 'testtest',
      };

      const error: any = new Error();

      error.response = {
        status: 400,
        data: {msgs: ['This is wrong', 'That is wrong']},
      };

      (axios.post as jest.Mock).mockRejectedValue(error);

      render(
        <RootContextProvider>
          <TestComponent input={input} screen="Login" />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(axios.post).toBeCalledWith('/auth/login', input);

        expect(screen.getByText(error.response.data.msgs[0])).toBeVisible();
        expect(screen.getByText(error.response.data.msgs[1])).toBeVisible();
      });
    });
  });
});
