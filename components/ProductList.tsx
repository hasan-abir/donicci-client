import {RouteProp, useRoute} from '@react-navigation/native';
import {Box, FlatList, Heading, Spinner, Text, useTheme} from 'native-base';
import {memo, useCallback, useContext, useEffect, useState} from 'react';
import {RootContext, ErrorType} from '../context/RootContext';
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
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [endOfDataList, setEndOfDataList] = useState<boolean>(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(lastUpdatedAt, true);
    setRefreshing(false);
  }, [lastUpdatedAt]);

  const onEndReached = useCallback(async () => {
    if (!loading && !endOfDataList && !refreshing && !error) {
      await fetchData(lastUpdatedAt);
    }
  }, [loading, endOfDataList, refreshing, error, lastUpdatedAt]);

  const fetchData = useCallback(
    async (next: string | undefined, reset?: boolean) => {
      try {
        setLoading(true);
        clearError(ErrorType.Fetch);

        let prevProducts = [...products];

        if (reset) {
          prevProducts = [];
          next = undefined;

          setProducts(prevProducts);
          setLastUpdatedAt(next);
          setEndOfDataList(false);
        }

        const data = await productController.fetchProducts(
          next,
          categoryId,
          term,
        );

        setProducts([...prevProducts, ...data]);
        if (data.length > 0) {
          setLastUpdatedAt(data[data.length - 1].updated_at);
        } else {
          setEndOfDataList(true);
        }
      } catch (error: any) {
        handleError(error, route.name, ErrorType.Fetch);
      } finally {
        setLoading(false);
      }
    },
    [products, term],
  );

  useEffect(() => {
    fetchData(lastUpdatedAt, true);
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
              <Text
                fontFamily="body"
                fontSize="md"
                mb={2}
                testID="user-greeting">
                Welcome, {user.display_name}!
              </Text>
            ) : null}
            <Heading
              fontFamily="body"
              fontWeight="semibold"
              mb={6}
              fontSize="3xl"
              testID="main-heading">
              {headerTitle || 'Latest products'}
            </Heading>
          </Box>
        );
      }}
      ListFooterComponent={() => (
        <Box justifyContent="center" mb={6}>
          {loading && !refreshing ? (
            <Spinner
              color={colors.gray[300]}
              size="lg"
              testID="fetching-spinner"
            />
          ) : products.length < 1 ? (
            <Text fontFamily="body" textAlign="center">
              No products found...
            </Text>
          ) : endOfDataList ? (
            <Text
              fontFamily="body"
              textAlign="center"
              testID="end-of-data-text">
              That's all for now!
            </Text>
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
