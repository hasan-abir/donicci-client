import type {StackScreenProps} from '@react-navigation/stack';
import type {RootStackParamList} from '../stacks/RootStack';
import {Box, Heading} from 'native-base';
import {useEffect} from 'react';
import SearchForm from '../components/SearchForm';

type Props = StackScreenProps<RootStackParamList, 'Search'>;

const SearchScreen = ({navigation}: Props) => {
  useEffect(() => {
    navigation.setOptions({
      headerLeftContainerStyle: {flexBasis: 'auto'},
      headerTitleContainerStyle: {flexGrow: 1},
      headerTitle() {
        return <SearchForm />;
      },
      headerRightContainerStyle: {display: 'none'},
    });
  }, [navigation]);

  return (
    <Box height="full" justifyContent="center" alignItems="center">
      <Heading>Search</Heading>
    </Box>
  );
};

export default SearchScreen;
