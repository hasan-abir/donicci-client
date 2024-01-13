import axios from 'axios';
import {API_URL} from './config';
import {attemptRefreshToken} from '../context/RootContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = API_URL;

axiosInstance.interceptors.response.use(
  response => {
    if (response.data.length) {
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i]._id && response.data[i]._id.$oid) {
          response.data[i]._id = response.data[i]._id.$oid;

          if (response.data[i].product_id && response.data[i].product_id.$oid) {
            response.data[i].product_id = response.data[i].product_id.$oid;
          }
        }
      }
    } else if (response.data && response.data._id && response.data._id.$oid) {
      response.data._id = response.data._id.$oid;

      if (response.data.category_list) {
        for (let i = 0; i < response.data.category_list.length; i++) {
          response.data.category_list[i]._id =
            response.data.category_list[i]._id.$oid;
        }
      }
    }

    return response;
  },
  async error => {
    const config = error?.config;

    if (
      error.response &&
      error.response.status === 401 &&
      config.url !== '/auth/login'
    ) {
      try {
        const newToken = await attemptRefreshToken();
        config.headers = {
          Authorization: 'Bearer ' + newToken,
        };

        // Loop original request
        return axiosInstance(config);
      } catch (err) {
        await AsyncStorage.removeItem('@user_token');
        await AsyncStorage.removeItem('@refresh_token');
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
