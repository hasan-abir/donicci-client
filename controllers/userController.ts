interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const register = async (input: RegisterInput): Promise<Boolean> => {
  return new Promise((resolve, reject) => {
    resolve(true);
  });
};

const login = async (input: LoginInput): Promise<Boolean> => {
  return new Promise((resolve, reject) => {
    resolve(true);
  });
};

export default {
  register,
  login,
};
