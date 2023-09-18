import axios from 'axios';
import Config from 'react-native-config';

export interface User {
  username: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  display_name: string;
  username: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

axios.defaults.baseURL = Config.API_URL;

const register = async (input: RegisterInput): Promise<string> => {
  const response = await axios.post<AuthResponse>('/auth/register', {
    user: input,
  });

  return response.data.access_token;
};

const login = async (input: LoginInput): Promise<string> => {
  const response = await axios.post<AuthResponse>('/auth/login', input);

  return response.data.access_token;
};

const getCurrentUser = async (token: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    let error: boolean = false;
    const user = {username: 'Hasan Abir'};

    if (Math.floor(Math.random() * 5) === 1) {
      error = true;
    }

    if (error) {
      const errObj: any = new Error();
      errObj.response = {
        status: 500,
        data: {msg: "Sommin'"},
      };

      reject(errObj);
    }

    resolve(user);
  });
};

export default {
  register,
  login,
  getCurrentUser,
};
