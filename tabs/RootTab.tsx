import {useEffect} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import type {StackScreenProps} from '@react-navigation/stack';
import type {RootStackParamList} from '../stacks/RootStack';

import CartScreen from '../screens/CartScreen';
import CategoryListScreen from '../screens/CategoryListScreen';
import HomeScreen from '../screens/HomeScreen';

import {theme} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TabHeader from '../components/TabHeader';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const Tab = createBottomTabNavigator<RootTabParamList>();

const tabBarStyle = {
  paddingBottom: 10,
  height: 60,
  borderTopColor: theme.colors.black,
  borderTopWidth: 2,
};

const RootTab = ({navigation}: Props) => {
  useEffect(() => {
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
        tabBarInactiveTintColor: theme.colors.gray[600],
        tabBarActiveTintColor: theme.colors.black,
        tabBarBadgeStyle: {backgroundColor: theme.colors.yellow[400]},
        header() {
          return <TabHeader />;
        },
      }}>
      <Tab.Screen
        name="Products"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon(props) {
            return (
              <Ionicons
                name={props.focused ? 'home' : 'home-outline'}
                size={24}
                color={theme.colors.black}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarBadge: 5,
          tabBarIcon(props) {
            return (
              <Ionicons
                name={props.focused ? 'cart' : 'cart-outline'}
                size={24}
                color={theme.colors.black}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoryListScreen}
        options={{
          tabBarIcon(props) {
            return (
              <Ionicons
                name={props.focused ? 'list' : 'list-outline'}
                size={24}
                color={theme.colors.black}
              />
            );
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
