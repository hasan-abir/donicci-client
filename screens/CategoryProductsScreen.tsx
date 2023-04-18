import type {StackScreenProps} from '@react-navigation/stack';
import {Box, Button, Text, VStack} from 'native-base';
import {useContext, useEffect, useState, useCallback} from 'react';
import type {Category} from '../components/CategoryItem';
import ProductList from '../components/ProductList';
import {RootContext} from '../context/RootContext';
import categoryController from '../controllers/categoryController';
import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';

type Props = StackScreenProps<
  RootStackParamList & RootTabParamList,
  'CategoryProducts'
>;

const CategoryProductsScreen = ({navigation, route}: Props) => {
  const {clearError, handleError} = useContext(RootContext);

  const [category, setCategory] = useState<Category | null | undefined>(null);

  const fetchData = useCallback(async () => {
    try {
      clearError();

      const data = await categoryController.fetchSingleCategory(
        route.params.categoryId,
      );
      setCategory(data);

      if (data) {
        navigation.setOptions({title: data.name});
      }
    } catch (error: any) {
      handleError(error, route.name);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [navigation]);
  return (
    <Box flex={1} px={3}>
      {category ? (
        <ProductList
          categoryId={route.params.categoryId}
          headerTitle={'Products in: ' + category?.name}
        />
      ) : (
        <VStack alignItems="center" mt={6}>
          <Text mb={3} fontSize="lg">
            Category not found
          </Text>
          <Button onPress={() => navigation.navigate('Categories')}>
            <Text fontSize="md" px={4}>
              Go back to Categories
            </Text>
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default CategoryProductsScreen;
