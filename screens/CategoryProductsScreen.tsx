import type {StackScreenProps} from '@react-navigation/stack';
import {
  Box,
  FlatList,
  Heading,
  ScrollView,
  Spinner,
  Text,
  theme,
} from 'native-base';
import type {RootStackParamList} from '../stacks/RootStack';
import {RefreshControl} from 'react-native';
import {useCallback, useEffect, useState} from 'react';
import type {Category} from '../components/CategoryItem';
import categoryController from '../controllers/categoryController';
import type {Product} from '../components/ProductItem';
import productController from '../controllers/productController';
import ProductItem from '../components/ProductItem';

type Props = StackScreenProps<RootStackParamList, 'CategoryProducts'>;

const CategoryProductsScreen = ({navigation, route}: Props) => {
  const [category, setCategory] = useState<Category | null | undefined>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [endOfDataList, setEndOfDataList] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(currentPage, true);
    setRefreshing(false);
  }, []);

  const onEndReached = async () => {
    if (!loading && !endOfDataList && !refreshing && !errorMsg) {
      const page = currentPage + 1;
      setCurrentPage(page);

      await fetchData(page);
    }
  };

  const fetchData = async (page: number, reset?: boolean) => {
    try {
      setLoading(true);
      setErrorMsg(null);

      let prevProducts = [...products];

      if (reset) {
        prevProducts = [];
        page = 1;

        setProducts(prevProducts);
        setCurrentPage(page);
        setEndOfDataList(false);
      }

      const categoryData = await categoryController.fetchSingleCategory(
        route.params.categoryId,
      );
      setCategory(categoryData);

      if (categoryData) {
        navigation.setOptions({title: categoryData.name});
      }

      const productsData = await productController.fetchProducts(
        page,
        route.params.categoryId,
      );

      setProducts([...prevProducts, ...productsData]);

      if (productsData.length === 0) {
        setEndOfDataList(true);
      }
    } catch (error: any) {
      const status = error.response.status;
      const data = error.response.data;

      setErrorMsg(data.msg);

      if (status === 500) {
        setErrorMsg('Something went wrong, try refreshing');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, true);
  }, [navigation]);
  return (
    <Box flex={1} px={3}>
      {errorMsg ? (
        <Text my={3} color={theme.colors.red[600]} fontWeight="bold">
          {errorMsg}
        </Text>
      ) : null}
      <FlatList
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        onRefresh={onRefresh}
        refreshing={refreshing}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        data={products}
        ListHeaderComponent={
          <Heading my={5}>Products in: {category?.name}</Heading>
        }
        ListFooterComponent={
          <Box justifyContent="center">
            {endOfDataList ? (
              <Text py={3} textAlign="center">
                You have reached the end of the list...
              </Text>
            ) : loading && !refreshing ? (
              <Spinner py={3} color={theme.colors.gray[300]} size="lg" />
            ) : null}
          </Box>
        }
        keyExtractor={(item, index) => item._id}
        renderItem={({item}) => <ProductItem item={item} />}
      />
    </Box>
  );
};

export default CategoryProductsScreen;
