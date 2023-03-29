import type {StackScreenProps} from '@react-navigation/stack';
import {Box, Heading} from 'native-base';
import {useContext, useEffect} from 'react';
import ProductList from '../components/ProductList';
import {RootContext} from '../context/RootContext';
import type {RootStackParamList} from '../stacks/RootStack';

interface Props extends StackScreenProps<RootStackParamList, 'Search'> {}

const SearchScreen = ({route}: Props) => {
  const {clearError} = useContext(RootContext);

  useEffect(() => {
    clearError();
  }, []);
  return (
    <Box flex={1} px={3}>
      {route.params.term && route.params.term.length > 0 ? (
        <ProductList
          term={route.params.term}
          headerTitle={'Results for ' + '"' + route.params.term + '"'}
        />
      ) : (
        <Heading mt={5}>Type in input above to search</Heading>
      )}
    </Box>
  );
};

export default SearchScreen;
