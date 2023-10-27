import type {StackScreenProps} from '@react-navigation/stack';
import {Box, Button, ScrollView, Spinner, Text, useTheme} from 'native-base';
import {useCallback, useContext, useEffect, useState} from 'react';
import {RefreshControl} from 'react-native';
import ProductDetails from '../components/ProductDetails';
import type {Product} from '../components/ProductItem';
import {ErrorType, RootContext} from '../context/RootContext';
import productController from '../controllers/productController';
import type {RootStackParamList} from '../stacks/RootStack';

interface Props
  extends StackScreenProps<RootStackParamList, 'ProductDetails'> {}

const truncate = (str: string, n: number, useWordBoundary?: boolean) => {
  if (str.length <= n) {
    return str;
  }
  const subString = str.slice(0, n - 1);
  return (
    (useWordBoundary
      ? subString.slice(0, subString.lastIndexOf(' '))
      : subString) + '...'
  );
};

const ProductDetailsScreen = ({route, navigation}: Props) => {
  const {handleError, clearError} = useContext(RootContext);
  const {colors} = useTheme();

  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | undefined>(undefined);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProduct();
    setRefreshing(false);
  }, []);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      clearError(ErrorType.Fetch);

      const data = await productController.fetchSingleProduct(
        route.params.productId,
      );
      setProduct(data);

      if (data) {
        navigation.setOptions({title: truncate(data.title, 30, true)});
      }
    } catch (error: any) {
      handleError(error, route.name, ErrorType.Fetch);
    } finally {
      setLoading(false);
    }
  }, [route]);

  useEffect(() => {
    fetchProduct();
  }, []);
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      testID="scrollview">
      <Box flex={1} px={6} mt={6}>
        {loading && !refreshing ? (
          <Box mt={6} justifyContent="center">
            <Spinner py={3} color={colors.gray[300]} size="lg" />
          </Box>
        ) : product ? (
          <Box>
            <ProductDetails product={product} />
            <Button
              borderRadius={100}
              mb={6}
              onPress={() => {
                navigation.navigate('Reviews', {productId: product._id});
              }}
              bgColor={colors.primary[100]}
              _text={{
                fontFamily: 'body',
                fontWeight: 'bold',
                color: colors.primary[500],
              }}
              testID="to-reviews-btn">
              User Reviews
            </Button>
          </Box>
        ) : (
          <Box>
            <Text mb={6} textAlign="center" fontSize="xl" fontFamily="body">
              Product not found
            </Text>
          </Box>
        )}
      </Box>
    </ScrollView>
  );
};

export default ProductDetailsScreen;
