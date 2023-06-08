import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {Badge, HStack, Pressable, Text, useTheme} from 'native-base';
import {useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RootContext} from '../context/RootContext';
import {RootTabParamList, tabScreens} from '../tabs/RootTab';

interface TabBarIconProps {
  focused?: boolean;
  icon: string;
}

const TabBarIcon = ({focused, icon}: TabBarIconProps) => {
  const {colors} = useTheme();

  return (
    <Ionicons
      name={focused ? icon : icon + '-outline'}
      size={32}
      color={focused ? colors.primary[500] : colors.black}
    />
  );
};

const TabBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
  const {cartItems} = useContext(RootContext);
  const {colors} = useTheme();

  return (
    <HStack
      justifyContent="space-between"
      backgroundColor={colors.white}
      alignItems="center"
      borderTopRadius={20}
      px={6}
      py={4}>
      {state.routes.map((route, index) => {
        const {icon, label} = tabScreens[route.name as keyof RootTabParamList];
        const isActive = state.index === index;

        return (
          <Pressable
            onPress={() => navigation.navigate(route.name)}
            key={index}>
            <HStack
              space="sm"
              alignItems="center"
              backgroundColor={isActive ? colors.primary[100] : null}
              py={2}
              px={isActive ? 4 : 0}
              borderRadius={100}>
              <TabBarIcon icon={icon} focused={isActive} />
              {isActive ? (
                <Text
                  fontFamily="body"
                  fontWeight="bold"
                  color={colors.primary[500]}>
                  {label || route.name}
                </Text>
              ) : null}
              {route.name === 'Cart' && cartItems.length > 0 ? (
                <Badge
                  bgColor={colors.secondary[500]}
                  variant="solid"
                  rounded="full"
                  position="absolute"
                  _text={{fontFamily: 'body', fontWeight: 'bold'}}
                  top={0}
                  right={-2}>
                  {cartItems.length}
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
