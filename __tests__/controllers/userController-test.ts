/**
 * @format
 */
import 'react-native';

import axios from 'axios';
import userController from '../../controllers/userController';

jest.mock('axios');

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

      (axios.post as jest.Mock).mockResolvedValue(response);

      const token = await userController.login(input);

      expect(token).toBe(response.data.access_token);
      expect(axios.post).toHaveBeenCalledWith('/auth/login', input);
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

      (axios.post as jest.Mock).mockResolvedValue(response);

      const token = await userController.register(input);

      expect(token).toBe(response.data.access_token);
      expect(axios.post).toHaveBeenCalledWith('/auth/register', {user: input});
    });
  });
});
