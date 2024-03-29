import {FC, useContext, useCallback, useEffect} from 'react';

import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import type {StackScreenProps} from '@react-navigation/stack';
import type {RootStackParamList} from '../stacks/RootStack';

import CartScreen from '../screens/CartScreen';
import CategoryListScreen from '../screens/CategoryListScreen';
import HomeScreen from '../screens/HomeScreen';

import TabBar from '../components/TabBar';
import {RootContext} from '../context/RootContext';
import {Box, Text, Spinner} from '@gluestack-ui/themed';
import SplashScreen from 'react-native-splash-screen';

interface Props extends StackScreenProps<RootStackParamList, 'Home'> {}

const Tab = createBottomTabNavigator<RootTabParamList>();

export const tabScreens: {
  [Key in keyof RootTabParamList]: {
    component: FC<BottomTabScreenProps<RootTabParamList, Key>>;
    icon: string;
    label?: string;
  };
} = {
  Products: {
    label: 'Home',
    component: HomeScreen,
    icon: 'home',
  },
  Cart: {
    component: CartScreen,
    icon: 'cart',
  },
  Categories: {
    component: CategoryListScreen,
    icon: 'list',
  },
};

const RootTab = ({navigation, route}: Props) => {
  const {verifyCurrentUser, authenticating, user} = useContext(RootContext);

  const onMount = useCallback(async () => {
    await verifyCurrentUser();
    SplashScreen.hide();
  }, [user]);

  useEffect(() => {
    onMount();
  }, []);

  if (authenticating) {
    return (
      <Box alignItems="center" justifyContent="center" flex={1}>
        <Spinner color="$coolGray300" size="large" />
      </Box>
    );
  }

  return (
    <Tab.Navigator
      initialRouteName="Products"
      tabBar={props => <TabBar {...props} />}
      screenOptions={{headerShown: false}}>
      {Object.entries(tabScreens).map(([name, {component, label}]) => (
        <Tab.Screen
          key={name}
          name={name as keyof RootTabParamList}
          component={
            component as FC<
              BottomTabScreenProps<RootTabParamList, keyof RootTabParamList>
            >
          }
        />
      ))}
    </Tab.Navigator>
  );
};

export type RootTabParamList = {
  Products: undefined;
  Cart: undefined;
  Categories: undefined;
};

export default RootTab;
