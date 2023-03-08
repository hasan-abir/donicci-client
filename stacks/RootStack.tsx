import {createStackNavigator} from '@react-navigation/stack';
import RootTab from '../tabs/RootTab';

import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import SearchScreen from '../screens/SearchScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import StackHeader from '../components/StackHeader';

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => {
  return (
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
