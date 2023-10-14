/**
 * @format
 */
import 'react-native';

import axiosInstance from '../../../axios/instance';
import userController from '../../../controllers/userController';

jest.mock('../../../axios/instance');

describe('UserController', () => {
  describe('login', () => {
    it('authenticates correctly', async () => {
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

      (axiosInstance.post as jest.Mock).mockResolvedValue(response);

      const authResponse = await userController.login(input);

      expect(authResponse.access_token).toBe(response.data.access_token);
      expect(authResponse.refresh_token).toBe(response.data.refresh_token);
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', input);
    });
  });

  describe('register', () => {
    it('authenticates correctly', async () => {
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

      (axiosInstance.post as jest.Mock).mockResolvedValue(response);

      const authResponse = await userController.register(input);

      expect(authResponse.access_token).toBe(response.data.access_token);
      expect(authResponse.refresh_token).toBe(response.data.refresh_token);
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/register', {
        user: input,
      });
    });
  });

  describe('getCurrentUser', () => {
    it('gets user correctly', async () => {
      const token = '123';
      const response = {
        data: {
          username: 'hasan_abir1999',
          display_name: 'Hasan Abir',
        },
      };

      (axiosInstance.get as jest.Mock).mockResolvedValue(response);

      const user = await userController.getCurrentUser(token);

      expect(user).toBe(response.data);
      expect(axiosInstance.get).toHaveBeenCalledWith('/auth/currentuser', {
        headers: {Authorization: 'Bearer ' + token},
      });
    });
  });

  describe('refreshToken', () => {
    it('refreshesToken', async () => {
      const refreshToken = '768';
      const response = {
        data: {
          access_token: '123',
          refresh_token: '456',
        },
      };

      (axiosInstance.post as jest.Mock).mockResolvedValue(response);

      const authResponse = await userController.refreshToken(refreshToken);

      expect(authResponse).toBe(response.data);
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/refresh-token', {
        token: refreshToken,
      });
    });
  });
  describe('logout', () => {
    it('logs the user out', async () => {
      const token = '123';

      (axiosInstance.delete as jest.Mock).mockResolvedValue(null);

      await userController.logout(token);

      expect(axiosInstance.delete).toHaveBeenCalledWith('/auth/logout', {
        headers: {Authorization: 'Bearer ' + token},
      });
    });
  });
});
