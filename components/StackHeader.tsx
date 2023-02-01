import type {StackHeaderProps} from '@react-navigation/stack';
import {Box, Text, theme} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchForm from './SearchForm';

const StackHeader = ({navigation, options, route}: StackHeaderProps) => {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      borderBottomColor={theme.colors.gray[300]}
      borderBottomWidth={1}
      p={3}>
      <Ionicons
        name={'arrow-back'}
        size={32}
        color={theme.colors.black}
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
    </Box>
  );
};

export default StackHeader;
