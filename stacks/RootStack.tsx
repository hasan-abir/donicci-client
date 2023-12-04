import {createStackNavigator} from '@react-navigation/stack';
import RootTab from '../tabs/RootTab';

import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {useContext, useEffect} from 'react';
import axiosInstance from '../axios/instance';
import StackHeader from '../components/StackHeader';
import {RootContext} from '../context/RootContext';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import LoginScreen from '../screens/LoginScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SearchScreen from '../screens/SearchScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import {config} from '../config/gluestack-ui.config';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => {
  const {attemptRefreshToken} = useContext(RootContext);

  const navTheme = {
    ...DefaultTheme,
    // Change app background
    colors: {
      ...DefaultTheme.colors,
      background: config.tokens.colors.coolGray100,
    },
  };

  useEffect(() => {
    axiosInstance.interceptors.response.use(
      response => {
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
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      },
    );
  });

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          header(props) {
            return <StackHeader {...props} />;
          },
        }}>
        <Stack.Screen name="Home" component={RootTab} />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{title: ' '}}
        />
        <Stack.Screen
          name="Reviews"
          component={ReviewsScreen}
          options={{title: ' '}}
        />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen
          name="CategoryProducts"
          component={CategoryProductsScreen}
          options={{title: ' '}}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export type RootStackParamList = {
  Home: undefined;
  ProductDetails: {productId: string};
  Reviews: {productId: string};
  Search: {term?: string};
  CategoryProducts: {categoryId: string};
  Login: undefined;
  Register: undefined;
};

export default RootStack;
