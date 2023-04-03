import {useContext} from 'react';

import type {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import {Alert, Box, HStack, Text, useTheme} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RootContext} from '../context/RootContext';
import SearchForm from './SearchForm';

const TabHeader = ({navigation, route}: BottomTabHeaderProps) => {
  const {error, user, logOutUser} = useContext(RootContext);
  const {colors} = useTheme();

  return (
    <Box>
      {error && error.name === route.name && (
        <Alert w="100%" py={3} px={6} status="error">
          <HStack space={2} flexShrink={1}>
            <Alert.Icon />
            <Text fontSize="md" color={colors.coolGray[800]} lineHeight={20}>
              {error.msg}
            </Text>
          </HStack>
        </Alert>
      )}
      <HStack
        zIndex={10}
        backgroundColor={colors.white}
        alignItems="center"
        borderBottomColor={colors.gray[300]}
        borderBottomWidth={1}
        p={3}>
        <Box flex={1} mr={2}>
          <SearchForm />
        </Box>
        {user ? (
          <Ionicons
            name={'exit-outline'}
            size={32}
            color={colors.black}
            onPress={() => logOutUser()}
          />
        ) : (
          <Ionicons
            name={'person-circle'}
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
