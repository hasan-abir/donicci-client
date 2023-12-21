import type {StackHeaderProps} from '@react-navigation/stack';
import {useContext, useMemo} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RootContext} from '../context/RootContext';
import SearchForm from './SearchForm';
import {Alert, Box, HStack, Text, VStack} from '@gluestack-ui/themed';
import {config} from '../config/gluestack-ui.config';

const StackHeader = ({navigation, options, route}: StackHeaderProps) => {
  const {error, user, logOutUser} = useContext(RootContext);

  const inSearchScreen = useMemo<boolean>(
    () => route.name === 'Search',
    [route.name],
  );
  const inBottomTabsScreen = useMemo<boolean>(
    () => route.name === 'Home',
    [route.name],
  );
  return (
    <Box>
      {error && error.name === route.name && (
        <Alert
          w="100%"
          py="$4"
          px="$6"
          backgroundColor="$error100"
          borderRadius="$none">
          <VStack space="sm" w="$full" flexShrink={1}>
            {error.msgs.map((msg, index) => {
              return (
                <Text
                  key={index}
                  fontSize="$sm"
                  color="$error600"
                  textAlign="center"
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
        backgroundColor="$white"
        alignItems="center"
        justifyContent="space-between"
        borderBottomEndRadius={20}
        borderBottomStartRadius={20}
        elevation="$0.5"
        px="$6"
        py="$4">
        {!inBottomTabsScreen ? (
          <Ionicons
            name={'chevron-back-outline'}
            size={32}
            color={config.tokens.colors.black}
            testID="back-btn"
            style={{marginRight: 16}}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
          />
        ) : null}
        {inBottomTabsScreen || inSearchScreen ? (
          <Box flex={1} mr="$4" testID="search-box">
            <SearchForm />
          </Box>
        ) : null}

        {!inBottomTabsScreen && !inSearchScreen ? (
          <Text fontSize="$md" textAlign="right" ml="$4">
            {options.title || route.name}
          </Text>
        ) : null}

        {inBottomTabsScreen ? (
          user ? (
            <Ionicons
              testID="logout-btn"
              name={'exit-outline'}
              size={32}
              color={config.tokens.colors.black}
              onPress={() => logOutUser()}
            />
          ) : (
            <Ionicons
              testID="login-btn"
              name={'person-outline'}
              size={32}
              color={config.tokens.colors.black}
              onPress={() => navigation.navigate('Login')}
            />
          )
        ) : null}
      </HStack>
    </Box>
  );
};

export default StackHeader;
