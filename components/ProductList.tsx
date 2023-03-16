import {Box, FlatList, Heading, Spinner, Text, theme, View} from 'native-base';
import {useEffect, useState} from 'react';
import productController from '../controllers/productController';
import type {Product} from './ProductItem';
import ProductItem from './ProductItem';

type Props = {
  categoryId?: string;
  term?: string;
  headerTitle?: string;
};

const ProductList = ({categoryId, term, headerTitle}: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [endOfDataList, setEndOfDataList] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(currentPage, true);
    setRefreshing(false);
  };

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
  }, [term]);

  return (
    <Box flex={1}>
      <FlatList
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        onRefresh={onRefresh}
        refreshing={refreshing}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        data={products}
        ListHeaderComponent={
          <Heading my={5}>{headerTitle || 'Latest Products'}</Heading>
        }
        ListFooterComponent={
          <Box justifyContent="center">
            {endOfDataList ? (
              <Text py={3} textAlign="center">
                You have reached the end of the list...
              </Text>
            ) : loading && !refreshing ? (
              <Spinner py={3} color={theme.colors.gray[300]} size="lg" />
            ) : errorMsg ? (
              <Text my={3} color={theme.colors.red[600]} fontWeight="bold">
                {errorMsg}
              </Text>
            ) : null}
          </Box>
        }
        keyExtractor={(item, index) => item._id}
        renderItem={({item}) => <ProductItem item={item} />}
      />
    </Box>
  );
};

export default ProductList;
