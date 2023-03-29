import type {StackHeaderProps} from '@react-navigation/stack';
import {Alert, Box, HStack, Text, useTheme} from 'native-base';
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
        <Ionicons
          name={'arrow-back'}
          size={32}
          color={colors.black}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
          style={{marginRight: 10}}
        />
        {route.name === 'Search' ? (
          <Box flex={1}>
            <SearchForm />
          </Box>
        ) : (
          <Text fontSize={18}>{options.title || route.name}</Text>
        )}
      </HStack>
    </Box>
  );
};

export default StackHeader;
