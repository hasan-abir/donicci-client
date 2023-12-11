import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {HStack, Pressable, Badge, Text, BadgeText} from '@gluestack-ui/themed';
import {useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RootContext} from '../context/RootContext';
import {RootTabParamList, tabScreens} from '../tabs/RootTab';
import {config} from '../config/gluestack-ui.config';
import {BadgeIcon} from '@gluestack-ui/themed';

interface TabBarIconProps {
  focused?: boolean;
  icon: string;
}

const TabBarIcon = ({focused, icon}: TabBarIconProps) => {
  return (
    <Ionicons
      name={focused ? icon : icon + '-outline'}
      size={32}
      color={
        focused ? config.tokens.colors.primary700 : config.tokens.colors.black
      }
    />
  );
};

const TabBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
  const {cartItems} = useContext(RootContext);

  return (
    <HStack
      justifyContent="space-between"
      backgroundColor="$white"
      alignItems="center"
      borderTopStartRadius={20}
      borderTopEndRadius={20}
      elevation="$3"
      px="$6"
      py="$4">
      {state.routes.map((route, index) => {
        const {icon, label} = tabScreens[route.name as keyof RootTabParamList];
        const isActive = state.index === index;

        return (
          <Pressable
            onPress={() => navigation.navigate(route.name)}
            key={index}
            testID={route.name + '-btn'}>
            <HStack
              space="sm"
              alignItems="center"
              backgroundColor={isActive ? '$primary100' : '$white'}
              py="$2"
              px={isActive ? '$4' : '$0'}
              borderRadius="$full">
              <TabBarIcon icon={icon} focused={isActive} />
              {isActive ? (
                <Text
                  fontFamily="$heading"
                  fontWeight="$normal"
                  color="$primary700">
                  {label || route.name}
                </Text>
              ) : null}
              {route.name === 'Cart' && cartItems.length > 0 ? (
                <Badge
                  bgColor="$secondary700"
                  variant="solid"
                  rounded="$full"
                  position="absolute"
                  top={0}
                  right={-2}>
                  <BadgeText
                    fontFamily="$heading"
                    fontWeight="$normal"
                    color="$white"
                    testID="cart-items-length">
                    {cartItems.length}
                  </BadgeText>
                </Badge>
              ) : null}
            </HStack>
          </Pressable>
        );
      })}
    </HStack>
  );
};

export default TabBar;
