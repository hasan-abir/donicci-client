import {createStackNavigator} from '@react-navigation/stack';
import {useCallback, useContext, useEffect} from 'react';
import RootTab from '../tabs/RootTab';

import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {Box, Spinner, Text, theme, useTheme} from 'native-base';
import StackHeader from '../components/StackHeader';
import {RootContext} from '../context/RootContext';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import LoginScreen from '../screens/LoginScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => {
  const {colors} = useTheme();
  const {
    verifyCurrentUser,
    attemptRefreshToken,
    logOutUser,
    authenticating,
    error,
  } = useContext(RootContext);

  const navTheme = {
    ...DefaultTheme,
    // Change app background
    colors: {...DefaultTheme.colors, background: theme.colors.gray[100]},
  };

  const initialCheck = useCallback(async () => {
    await verifyCurrentUser();
  }, []);

  useEffect(() => {
    initialCheck();
  }, []);

  if (authenticating) {
    return (
      <Box alignItems="center" justifyContent="center" flex={1}>
        <Spinner py={3} color={colors.gray[300]} size="lg" />
      </Box>
    );
  }

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
  Search: {term?: string};
  CategoryProducts: {categoryId: string};
  Login: undefined;
  Register: undefined;
};

export default RootStack;
