import type {StackHeaderProps} from '@react-navigation/stack';
import {Alert, Box, HStack, Text, VStack, useTheme} from 'native-base';
import {useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RootContext} from '../context/RootContext';
import SearchForm from './SearchForm';

const StackHeader = ({navigation, options, route}: StackHeaderProps) => {
  const {error} = useContext(RootContext);
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
        justifyContent="space-between"
        borderBottomRadius={20}
        px={6}
        py={4}>
        <Ionicons
          name={'chevron-back-outline'}
          size={32}
          color={colors.black}
          testID="back-btn"
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
        />
        {route.name === 'Search' ? (
          <Box flex={1} ml={4}>
            <SearchForm />
          </Box>
        ) : (
          <Text fontSize="md" fontFamily="body" textAlign="right" ml={4}>
            {options.title || route.name}
          </Text>
        )}
      </HStack>
    </Box>
  );
};

export default StackHeader;
