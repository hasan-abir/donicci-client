import {useContext, useEffect} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import type {StackScreenProps} from '@react-navigation/stack';
import type {RootStackParamList} from '../stacks/RootStack';

import CartScreen from '../screens/CartScreen';
import CategoryListScreen from '../screens/CategoryListScreen';
import HomeScreen from '../screens/HomeScreen';

import {useTheme} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TabHeader from '../components/TabHeader';

import {RootContext} from '../context/RootContext';

interface Props extends StackScreenProps<RootStackParamList, 'Home'> {}

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabBarIcon = (props: {
  focused: boolean;
  color: string;
  size: number;
  icon: string;
}) => {
  const {colors} = useTheme();

  return (
    <Ionicons
      name={props.focused ? props.icon : props.icon + '-outline'}
      size={24}
      color={colors.black}
    />
  );
};

const RootTab = ({navigation}: Props) => {
  const {cartItems} = useContext(RootContext);
  const {colors} = useTheme();

  const tabBarStyle = {
    paddingBottom: 10,
    height: 60,
    borderTopColor: colors.gray[300],
    borderTopWidth: 1,
  };

  useEffect(() => {
    // Remove stack header
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  return (
    <Tab.Navigator
      initialRouteName="Products"
      screenOptions={{
        tabBarStyle,
        tabBarIconStyle: {marginTop: 10},
        tabBarInactiveTintColor: colors.gray[600],
        tabBarActiveTintColor: colors.black,
        tabBarBadgeStyle: {backgroundColor: colors.primary[400]},
        header(props) {
          return <TabHeader {...props} />;
        },
      }}>
      <Tab.Screen
        name="Products"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon(props) {
            return <TabBarIcon {...props} icon="home" />;
          },
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarBadge: cartItems.length > 0 ? cartItems.length : undefined,
          tabBarIcon(props) {
            return <TabBarIcon {...props} icon="cart" />;
          },
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoryListScreen}
        options={{
          tabBarIcon(props) {
            return <TabBarIcon {...props} icon="list" />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export type RootTabParamList = {
  Products: undefined;
  Cart: undefined;
  Categories: undefined;
};

export default RootTab;
