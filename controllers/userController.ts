import axiosInstance from '../axios/instance';

export interface User {
  username: string;
  display_name: string;
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

const register = async (input: RegisterInput): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/register', {
    user: input,
  });

  return response.data;
};

const login = async (input: LoginInput): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', input);

  return response.data;
};

const getCurrentUser = async (token: string): Promise<User> => {
  const response = await axiosInstance.get<User>('/auth/currentuser', {
    headers: {Authorization: 'Bearer ' + token},
  });

  return response.data;
};

const refreshToken = async (token: string | null): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    '/auth/refresh-token',
    {
      token,
    },
  );

  return response.data;
};

const logout = async (token: string | null): Promise<void> => {
  await axiosInstance.delete<AuthResponse>('/auth/logout', {
    headers: {Authorization: 'Bearer ' + token},
  });
};

export default {
  register,
  login,
  getCurrentUser,
  refreshToken,
  logout,
};
