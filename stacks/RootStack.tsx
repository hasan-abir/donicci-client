import {createStackNavigator} from '@react-navigation/stack';
import RootTab from '../tabs/RootTab';

import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import StackHeader from '../components/StackHeader';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import LoginScreen from '../screens/LoginScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SearchScreen from '../screens/SearchScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import {config} from '../config/gluestack-ui.config';

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => {
  const navTheme = {
    ...DefaultTheme,
    // Change app background
    colors: {
      ...DefaultTheme.colors,
      background: config.tokens.colors.coolGray100,
    },
  };

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
