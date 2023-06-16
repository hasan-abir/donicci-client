import type {StackScreenProps} from '@react-navigation/stack';
import {Box, Button, Text, VStack, useTheme} from 'native-base';
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

  const {colors} = useTheme();

  const [category, setCategory] = useState<Category | null | undefined>(null);

  const fetchData = useCallback(async () => {
    try {
      clearError();

      const data = await categoryController.fetchSingleCategory(
        route.params.categoryId,
      );
      // setCategory(data);

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
    <Box flex={1}>
      {category ? (
        <ProductList
          categoryId={route.params.categoryId}
          headerTitle={category?.name}
        />
      ) : (
        <Box mt={6} mx={6}>
          <Text mb={3} textAlign="center" fontSize="xl" fontFamily="body">
            Category not found
          </Text>
          <Button
            py={2}
            px={6}
            borderRadius={20}
            onPress={() => navigation.navigate('Categories')}
            bgColor={colors.secondary[500]}
            _text={{fontFamily: 'body', fontWeight: 'bold'}}>
            BACK TO CATEGORIES
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CategoryProductsScreen;
