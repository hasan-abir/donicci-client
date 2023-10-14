/**
 * @format
 */

import axiosInstance from '../../../axios/instance';
import React, {useContext, useEffect} from 'react';
import 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {render, screen, waitFor} from '@testing-library/react-native';
import {Text, View} from 'react-native';
import RootContextProvider, {RootContext} from '../../../context/RootContext';
import type {
  LoginInput,
  RegisterInput,
} from '../../../controllers/userController';

jest.mock('../../../axios/instance');

interface AuthenticateUserComponentProps {
  input: LoginInput | RegisterInput;
  screen: string;
}

const TestComponent = () => {
  const {user, error} = useContext(RootContext);

  return (
    <View>
      <Text>{user?.display_name}</Text>
      {error?.msgs.map((msg, index) => {
        return <Text key={index}>{msg}</Text>;
      })}
    </View>
  );
};

describe('RootContext', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('authenticateUser', () => {
    const AuthenticateUserComponent = ({
      input,
      screen,
    }: AuthenticateUserComponentProps) => {
      const {authenticateUser} = useContext(RootContext);
      const initialRequest = async () => {
        await authenticateUser(input, screen);
      };

      useEffect(() => {
        initialRequest();
      }, []);
      return <TestComponent />;
    };

    it('stores user and token when login', async () => {
      const input = {
        email: 'hasan@test.com',
        password: 'testtest',
      };

      const user = {
        username: 'hasan_abir1999',
        display_name: 'Hasan Abir',
      };

      const response = {
        data: {
          access_token: '123',
          refresh_token: '456',
        },
      };

      (axiosInstance.post as jest.Mock).mockResolvedValue(response);
      (axiosInstance.get as jest.Mock).mockResolvedValue({data: user});
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        response.data.access_token,
      );
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        response.data.refresh_token,
      );

      render(
        <RootContextProvider>
          <AuthenticateUserComponent input={input} screen="Login" />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(axiosInstance.post).toBeCalledWith('/auth/login', input);
        expect(axiosInstance.get).toBeCalledWith('/auth/currentuser', {
          headers: {Authorization: 'Bearer ' + response.data.access_token},
        });
        expect(AsyncStorage.setItem).toBeCalledWith(
          '@user_token',
          response.data.access_token,
        );
        expect(AsyncStorage.setItem).toBeCalledWith(
          '@refresh_token',
          response.data.refresh_token,
        );
      });

      expect(screen.queryByText('Hasan Abir')).toBeOnTheScreen();
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
      const user = {
        username: 'hasan_abir1999',
        display_name: 'Hasan Abir',
      };

      (axiosInstance.post as jest.Mock).mockResolvedValue(response);
      (axiosInstance.get as jest.Mock).mockResolvedValue({data: user});
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        response.data.access_token,
      );
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        response.data.refresh_token,
      );

      render(
        <RootContextProvider>
          <AuthenticateUserComponent input={input} screen="Register" />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(axiosInstance.post).toBeCalledWith('/auth/register', {
          user: input,
        });
        expect(AsyncStorage.setItem).toBeCalledWith(
          '@user_token',
          response.data.access_token,
        );
        expect(AsyncStorage.setItem).toBeCalledWith(
          '@refresh_token',
          response.data.refresh_token,
        );
        expect(axiosInstance.get).toBeCalledWith('/auth/currentuser', {
          headers: {Authorization: 'Bearer ' + response.data.access_token},
        });
      });

      expect(screen.queryByText('Hasan Abir')).toBeOnTheScreen();
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

      (axiosInstance.post as jest.Mock).mockRejectedValue(error);

      render(
        <RootContextProvider>
          <AuthenticateUserComponent input={input} screen="Login" />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(axiosInstance.post).toBeCalledWith('/auth/login', input);

        expect(screen.queryByText(error.response.data.msg)).toBeOnTheScreen();
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

      (axiosInstance.post as jest.Mock).mockRejectedValue(error);

      render(
        <RootContextProvider>
          <AuthenticateUserComponent input={input} screen="Login" />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(axiosInstance.post).toBeCalledWith('/auth/login', input);

        expect(
          screen.queryByText('Something went wrong, try refreshing'),
        ).toBeOnTheScreen();
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

      (axiosInstance.post as jest.Mock).mockRejectedValue(error);

      render(
        <RootContextProvider>
          <AuthenticateUserComponent input={input} screen="Login" />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(axiosInstance.post).toBeCalledWith('/auth/login', input);

        expect(
          screen.queryByText(error.response.data.msgs[0]),
        ).toBeOnTheScreen();
        expect(
          screen.queryByText(error.response.data.msgs[1]),
        ).toBeOnTheScreen();
      });
    });
  });
  describe('verifyCurrentUser', () => {
    const VerifyCurrentUserComponent = () => {
      const {verifyCurrentUser} = useContext(RootContext);
      const initialRequest = async () => {
        await verifyCurrentUser();
      };

      useEffect(() => {
        initialRequest();
      }, []);
      return <TestComponent />;
    };

    it('stores user and token when verified', async () => {
      const access_token = '123';
      const refresh_token = '456';
      const response = {
        data: {
          username: 'hasan_abir1999',
          display_name: 'Hasan Abir',
        },
      };

      (axiosInstance.get as jest.Mock).mockResolvedValue(response);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      render(
        <RootContextProvider>
          <VerifyCurrentUserComponent />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(axiosInstance.get).toBeCalledWith('/auth/currentuser', {
          headers: {Authorization: 'Bearer ' + access_token},
        });
      });

      expect(screen.queryByText('Hasan Abir')).toBeOnTheScreen();
    });

    it("doesn't store user and token when token is null", async () => {
      const response = {
        data: {
          username: 'hasan_abir1999',
          display_name: 'Hasan Abir',
        },
      };

      (axiosInstance.get as jest.Mock).mockResolvedValue(response);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      render(
        <RootContextProvider>
          <VerifyCurrentUserComponent />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(axiosInstance.get).toBeCalledTimes(0);
      });

      expect(screen.queryByText('Hasan Abir')).not.toBeOnTheScreen();
    });
  });

  describe('refreshToken', () => {
    const RefreshTokenComponent = () => {
      const {attemptRefreshToken} = useContext(RootContext);
      const initialRequest = async () => {
        await attemptRefreshToken();
      };

      useEffect(() => {
        initialRequest();
      }, []);
      return <TestComponent />;
    };

    it('stores the token when valid token', async () => {
      const access_token = '768';
      const refresh_token = '768';
      const response = {
        data: {
          access_token: '123',
          refresh_token: '456',
        },
      };

      (axiosInstance.post as jest.Mock).mockResolvedValue(response);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      render(
        <RootContextProvider>
          <RefreshTokenComponent />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');
        expect(axiosInstance.post).toBeCalledWith('/auth/refresh-token', {
          token: refresh_token,
        });
        expect(AsyncStorage.setItem).toBeCalledWith(
          '@user_token',
          response.data.access_token,
        );
        expect(AsyncStorage.setItem).toBeCalledWith(
          '@refresh_token',
          response.data.refresh_token,
        );
      });
    });
  });

  describe('logOutUser', () => {
    const LogOutUserComponent = () => {
      const {logOutUser} = useContext(RootContext);

      const initialRequest = async () => {
        await logOutUser();
      };

      useEffect(() => {
        initialRequest();
      }, []);
      return <TestComponent />;
    };

    it('logs out the user', async () => {
      const accessToken = '123';
      const refresh_token = '123';

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(accessToken);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(refresh_token);
      (axiosInstance.delete as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(null);

      render(
        <RootContextProvider>
          <LogOutUserComponent />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');

        expect(axiosInstance.delete).toBeCalledWith('/auth/logout', {
          headers: {Authorization: 'Bearer ' + accessToken},
        });
        expect(AsyncStorage.removeItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.removeItem).toBeCalledWith('@refresh_token');
      });

      expect(screen.queryByText('Hasan Abir')).not.toBeOnTheScreen();
    });
  });
});
