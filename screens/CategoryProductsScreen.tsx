import type {StackScreenProps} from '@react-navigation/stack';
import type {RootStackParamList} from '../stacks/RootStack';
import {Box, Heading} from 'native-base';
import {useEffect} from 'react';

type Props = StackScreenProps<RootStackParamList, 'CategoryProducts'>;

const CategoryProductsScreen = ({navigation, route}: Props) => {
  useEffect(() => {
    navigation.setOptions({title: 'Category name'});
  }, [navigation]);
  return (
    <Box height="full" justifyContent="center" alignItems="center">
      <Heading>Category id: {route.params.categoryId}</Heading>
    </Box>
  );
};

export default CategoryProductsScreen;
