import {RouteProp, useRoute} from '@react-navigation/native';
import {Box, FlatList, Heading, Spinner, Text, useTheme} from 'native-base';
import {memo, useCallback, useContext, useEffect, useState} from 'react';
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

const areEqual = (prevProps: {item: Product}, nextProps: {item: Product}) =>
  prevProps.item === nextProps.item;
const PureProductItem = memo(ProductItem, areEqual);

const ProductList = ({categoryId, term, headerTitle}: Props) => {
  const route = useRoute<RouteProp<RootStackParamList & RootTabParamList>>();

  const {error, handleError, clearError, user} = useContext(RootContext);
  const {colors} = useTheme();

  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [endOfDataList, setEndOfDataList] = useState<boolean>(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(currentPage, true);
    setRefreshing(false);
  }, [currentPage]);

  const onEndReached = useCallback(async () => {
    if (!loading && !endOfDataList && !refreshing && !error) {
      const page = currentPage + 1;
      setCurrentPage(page);

      await fetchData(page);
    }
  }, [loading, endOfDataList, refreshing, error, currentPage]);

  const fetchData = useCallback(
    async (page: number, reset?: boolean) => {
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
    },
    [products, term],
  );

  useEffect(() => {
    fetchData(currentPage, true);
  }, [term]);

  return (
    <FlatList
      px={6}
      onEndReachedThreshold={0.5}
      onEndReached={onEndReached}
      onRefresh={onRefresh}
      refreshing={refreshing}
      data={products}
      testID="flat-list"
      ListHeaderComponent={() => {
        return (
          <Box mt={6}>
            {route.name === 'Products' && user ? (
              <Text fontSize="md" mb={2}>
                Welcome, {user.username}!
              </Text>
            ) : null}
            <Heading
              fontFamily="body"
              fontWeight="semibold"
              mb={6}
              fontSize="3xl">
              {headerTitle || 'Latest products'}
            </Heading>
          </Box>
        );
      }}
      ListFooterComponent={() => (
        <Box justifyContent="center" mb={6}>
          {loading && !refreshing ? (
            <Spinner color={colors.gray[300]} size="lg" />
          ) : products.length < 1 ? (
            <Text textAlign="center">No products found...</Text>
          ) : endOfDataList ? (
            <Text textAlign="center">That's all for now!</Text>
          ) : null}
        </Box>
      )}
      keyExtractor={(item, index) => item._id}
      renderItem={({item}: {item: Product}) => (
        <Box testID="flat-list-item">
          <PureProductItem item={item} />
        </Box>
      )}
    />
  );
};

export default ProductList;
