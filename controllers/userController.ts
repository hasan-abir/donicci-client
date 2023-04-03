export interface User {
  username: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

const register = async (input: RegisterInput): Promise<string> => {
  return new Promise((resolve, reject) => {
    let error: boolean = false;
    const token = '123';

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

    resolve(token);
  });
};

const login = async (input: LoginInput): Promise<string> => {
  return new Promise((resolve, reject) => {
    let error: boolean = false;
    const token = '123';

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

    resolve(token);
  });
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

    setTimeout(() => {
      resolve(user);
    }, 3000);
  });
};

export default {
  register,
  login,
  getCurrentUser,
};
