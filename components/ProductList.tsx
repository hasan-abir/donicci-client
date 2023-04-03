import {RouteProp, useRoute} from '@react-navigation/native';
import {Box, FlatList, Heading, Spinner, Text, useTheme} from 'native-base';
import {useContext, useEffect, useState} from 'react';
import {RootContext} from '../context/RootContext';
import productController from '../controllers/productController';
import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';
import type {Product} from './ProductItem';
import ProductItem from './ProductItem';

interface Props {
  categoryId?: string;
  term?: string;
  headerTitle?: string;
}

const ProductList = ({categoryId, term, headerTitle}: Props) => {
  const route = useRoute<RouteProp<RootStackParamList & RootTabParamList>>();

  const {error, handleError, clearError, user} = useContext(RootContext);
  const {colors} = useTheme();

  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [endOfDataList, setEndOfDataList] = useState<boolean>(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(currentPage, true);
    setRefreshing(false);
  };

  const onEndReached = async () => {
    if (!loading && !endOfDataList && !refreshing && !error) {
      const page = currentPage + 1;
      setCurrentPage(page);

      await fetchData(page);
    }
  };

  const fetchData = async (page: number, reset?: boolean) => {
    try {
      setLoading(true);
      clearError();

      let prevProducts = [...products];

      if (reset) {
        prevProducts = [];
        page = 1;

        setProducts(prevProducts);
        setCurrentPage(page);
        setEndOfDataList(false);
      }

      const data = await productController.fetchProducts(
        page,
        categoryId,
        term,
      );
      setProducts([...prevProducts, ...data]);

      if (data.length === 0) {
        setEndOfDataList(true);
      }
    } catch (error: any) {
      handleError(error, route.name);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, true);
  }, [term]);

  return (
    <FlatList
      onEndReachedThreshold={0.5}
      onEndReached={onEndReached}
      onRefresh={onRefresh}
      refreshing={refreshing}
      data={products}
      ListHeaderComponent={() => {
        return (
          <Box pt={5}>
            {route.name === 'Products' && user ? (
              <Text fontSize="md" mb={2}>
                Welcome, {user.username}!
              </Text>
            ) : null}
            <Heading mb={5}>{headerTitle || 'Latest Products'}</Heading>
          </Box>
        );
      }}
      ListFooterComponent={
        <Box justifyContent="center">
          {endOfDataList ? (
            <Text py={3} textAlign="center">
              You have reached the end of the list...
            </Text>
          ) : loading && !refreshing ? (
            <Spinner py={3} color={colors.gray[300]} size="lg" />
          ) : products.length < 1 ? (
            <Text py={3} textAlign="center">
              No products found...
            </Text>
          ) : null}
        </Box>
      }
      keyExtractor={(item, index) => item._id}
      renderItem={({item}) => <ProductItem item={item} />}
    />
  );
};

export default ProductList;
