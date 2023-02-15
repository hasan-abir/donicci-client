import {Box, FlatList, Heading, Spinner, Text, theme} from 'native-base';
import {useEffect, useState} from 'react';
import productController from '../controllers/productController';
import type {Product} from './ProductItem';
import ProductItem from './ProductItem';

type Props = {
  categoryId?: string;
  headerTitle?: string;
};

const ProductList = ({categoryId, headerTitle}: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [endOfDataList, setEndOfDataList] = useState<boolean>(false);

  const onRefresh = async () => {
    setRefreshing(true);
    if (currentPage > 1) {
      setProducts([]);
      setCurrentPage(1);
    } else {
      setRefreshing(false);
    }
  };

  const onEndReached = async () => {
    if (!loading && !endOfDataList && !refreshing) {
      setCurrentPage(currentPage + 1);
    }
  };

  const fetchData = async () => {
    setEndOfDataList(false);
    if (!refreshing) {
      setLoading(true);
    }
    const data = await productController.fetchProducts(currentPage, categoryId);
    setProducts([...products, ...data]);
    if (data.length === 0) {
      setEndOfDataList(true);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

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
            ) : loading ? (
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

export default ProductList;
