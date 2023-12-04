import type {StackScreenProps} from '@react-navigation/stack';
import {Box, Text} from '@gluestack-ui/themed';
import {useContext, useEffect} from 'react';
import ProductList from '../components/ProductList';
import {ErrorType, RootContext} from '../context/RootContext';
import type {RootStackParamList} from '../stacks/RootStack';

interface Props extends StackScreenProps<RootStackParamList, 'Search'> {}

const SearchScreen = ({route}: Props) => {
  const {clearError} = useContext(RootContext);

  useEffect(() => {
    clearError(ErrorType.Fetch);
  }, []);
  return (
    <Box flex={1}>
      {route.params.term && route.params.term.length > 0 ? (
        <ProductList
          term={route.params.term}
          headerTitle={'Results for ' + '"' + route.params.term + '"'}
        />
      ) : (
        <Text mt="$6" mx="$6" fontSize="$xl" testID="instruction">
          Type in input above to search
        </Text>
      )}
    </Box>
  );
};

export default SearchScreen;
