import type {StackScreenProps} from '@react-navigation/stack';
import type {RootStackParamList} from '../stacks/RootStack';
import {Box, FlatList, Heading, Spinner, theme} from 'native-base';
import {useEffect, useState} from 'react';
import demoCategories from '../controllers/demoCategories.json';
import demoProducts from '../controllers/demoProducts.json';
import type {Category} from '../components/CategoryItem';
import type {Product} from '../components/ProductItem';
import ProductItem from '../components/ProductItem';
import categoryController from '../controllers/categoryController';
import ProductList from '../components/ProductList';

type Props = StackScreenProps<RootStackParamList, 'CategoryProducts'>;

const CategoryProductsScreen = ({navigation, route}: Props) => {
  const [category, setCategory] = useState<Category | null | undefined>(null);

  const fetchData = async () => {
    const data = await categoryController.fetchSingleCategory(
      route.params.categoryId,
    );
    setCategory(data);

    if (data) {
      navigation.setOptions({title: data.name});
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigation]);
  return (
    <Box flex={1} px={3}>
      <ProductList headerTitle={category?.name} />
    </Box>
  );
};

export default CategoryProductsScreen;
