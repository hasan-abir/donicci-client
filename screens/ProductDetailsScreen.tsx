import type {StackScreenProps} from '@react-navigation/stack';
import {Box, FlatList, Heading, Spinner, Text, useTheme} from 'native-base';
import {memo, useCallback, useContext, useEffect, useState} from 'react';
import PostReview from '../components/PostReview';
import ProductDetails from '../components/ProductDetails';
import type {Product} from '../components/ProductItem';
import type {Review} from '../components/UserReview';
import UserReview from '../components/UserReview';
import {RootContext} from '../context/RootContext';
import productController from '../controllers/productController';
import reviewController from '../controllers/reviewController';
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

const areEqual = (prevProps: {review: Review}, nextProps: {review: Review}) =>
  prevProps.review === nextProps.review;
const PureUserReview = memo(UserReview, areEqual);

const ProductDetailsScreen = ({route, navigation}: Props) => {
  const {error, handleError, clearError, user, token} = useContext(RootContext);
  const {colors} = useTheme();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadingProduct, setLoadingProduct] = useState<boolean>(false);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [endOfDataList, setEndOfDataList] = useState<boolean>(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProduct();
    setRefreshing(false);
  }, []);

  const onEndReached = useCallback(async () => {
    if (!loadingReviews && !endOfDataList && !refreshing && !error && product) {
      const page = currentPage + 1;
      setCurrentPage(page);

      await fetchReviews(page, product._id);
    }
  }, [loadingReviews, endOfDataList, refreshing, error, product, currentPage]);

  const fetchReviews = useCallback(
    async (page: number, productId: string, reset?: boolean) => {
      try {
        setLoadingReviews(true);
        clearError();

        let prevReviews = [...reviews];

        if (reset) {
          prevReviews = [];
          page = 1;

          setReviews(prevReviews);
          setCurrentPage(page);
          setEndOfDataList(false);
        }

        const data = await reviewController.fetchReviews(page, productId);
        setReviews([...prevReviews, ...data]);

        if (data.length === 0) {
          setEndOfDataList(true);
        }
      } catch (error: any) {
        handleError(error, route.name);
      } finally {
        setLoadingReviews(false);
      }
    },
    [reviews],
  );

  const postReview = useCallback(
    async (description: string) => {
      try {
        if (user && token) {
          await reviewController.postReview(description, token);

          await fetchReviews(currentPage, route.params.productId, true);
        } else {
          navigation.navigate('Login');
        }
      } catch (error: any) {
        handleError(error, route.name);
      }
    },
    [user, token, currentPage],
  );

  const fetchProduct = useCallback(async () => {
    try {
      setLoadingProduct(true);
      clearError();

      const data = await productController.fetchSingleProduct(
        route.params.productId,
      );
      setProduct(data);

      if (data) {
        navigation.setOptions({title: truncate(data.title, 30, true)});

        await fetchReviews(currentPage, data._id, true);
      }
    } catch (error: any) {
      handleError(error, route.name);
    } finally {
      setLoadingProduct(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchProduct();
  }, []);
  return (
    <Box flex={1}>
      <FlatList
        px={6}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        onRefresh={onRefresh}
        refreshing={refreshing}
        data={reviews}
        testID="flat-list"
        ListHeaderComponent={() => {
          return (
            <Box mt={6}>
              {loadingProduct && !refreshing ? (
                <Box mt={6} justifyContent="center">
                  <Spinner py={3} color={colors.gray[300]} size="lg" />
                </Box>
              ) : product ? (
                <Box>
                  <ProductDetails product={product} />
                  <PostReview
                    postReview={postReview}
                    disabled={loadingReviews}
                  />
                  <Text mb={6} fontSize="xl" fontFamily="body">
                    User Reviews
                  </Text>
                </Box>
              ) : null}
            </Box>
          );
        }}
        ListFooterComponent={
          <Box justifyContent="center" mb={6}>
            {loadingReviews && !refreshing ? (
              <Spinner color={colors.gray[300]} size="lg" />
            ) : reviews.length < 1 ? (
              <Text textAlign="center">No reviews found...</Text>
            ) : endOfDataList ? (
              <Text textAlign="center">That's all for now!</Text>
            ) : null}
          </Box>
        }
        keyExtractor={(item, index) => item._id}
        renderItem={({item}) => (
          <Box testID="flat-list-item">
            <PureUserReview review={item} />
          </Box>
        )}
      />
    </Box>
  );
};

export default ProductDetailsScreen;
