import type {StackScreenProps} from '@react-navigation/stack';
import {Box, Heading} from 'native-base';
import ProductList from '../components/ProductList';
import type {RootStackParamList} from '../stacks/RootStack';

type Props = StackScreenProps<RootStackParamList, 'Search'>;

const SearchScreen = ({navigation, route}: Props) => {
  return (
    <Box flex={1} px={3}>
      {route.params.term ? (
        <ProductList
          headerTitle={'Results for ' + '"' + route.params.term + '"'}
        />
      ) : (
        <Heading mt={5}>Type in input above to search</Heading>
      )}
    </Box>
  );
};

export default SearchScreen;
