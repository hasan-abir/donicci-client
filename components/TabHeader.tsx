import {useContext} from 'react';

import type {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import {Alert, Box, HStack, Text, VStack, useTheme} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RootContext} from '../context/RootContext';
import SearchForm from './SearchForm';

const TabHeader = ({navigation, route}: BottomTabHeaderProps) => {
  const {error, user, logOutUser, authenticating} = useContext(RootContext);
  const {colors} = useTheme();

  return (
    <Box>
      {error && error.name === route.name && (
        <Alert
          w="100%"
          py={4}
          px={6}
          backgroundColor={colors.danger[100]}
          borderRadius={0}>
          <VStack space={2} flexShrink={1}>
            {error.msgs.map((msg, index) => {
              return (
                <Text
                  key={index}
                  fontSize="sm"
                  fontFamily="body"
                  color={colors.danger[600]}
                  lineHeight={20}>
                  {msg}
                </Text>
              );
            })}
          </VStack>
        </Alert>
      )}
      <HStack
        zIndex={10}
        backgroundColor={colors.white}
        alignItems="center"
        borderBottomRadius={20}
        px={6}
        py={4}>
        <Box flex={1} mr={4}>
          <SearchForm />
        </Box>
        {user ? (
          <Ionicons
            testID="logout-btn"
            name={'exit-outline'}
            size={32}
            color={colors.black}
            onPress={() => logOutUser()}
          />
        ) : (
          <Ionicons
            testID="login-btn"
            name={'person-outline'}
            size={32}
            color={colors.black}
            onPress={() => navigation.navigate('Login')}
          />
        )}
      </HStack>
    </Box>
  );
};

export default TabHeader;
