import type {StackScreenProps} from '@react-navigation/stack';
import {
  Box,
  Button,
  FlatList,
  Heading,
  HStack,
  Spinner,
  Text,
  theme,
} from 'native-base';
import {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageGallery from '../components/ImageGallery';
import type {Product} from '../components/ProductItem';
import StarRating from '../components/StarRating';
import UserReview from '../components/UserReview';
import type {Review} from '../components/UserReview';
import {RootContext} from '../context/RootContext';
import productController from '../controllers/productController';
import reviewController from '../controllers/reviewController';
import type {RootStackParamList} from '../stacks/RootStack';
import PostReview from '../components/PostReview';

type Props = StackScreenProps<RootStackParamList, 'ProductDetails'>;

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
  const {addItemToCart, removeItemFromCart, inCart} = useContext(RootContext);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [endOfDataList, setEndOfDataList] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addQuantity = () => {
    if (product && product.quantity && selectedQuantity < product.quantity) {
      setSelectedQuantity(selectedQuantity + 1);
    }
  };
  const deductQuantity = () => {
    if (product && product.quantity && selectedQuantity > 1) {
      setSelectedQuantity(selectedQuantity - 1);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReviews(currentPage, route.params.productId, true);
    setRefreshing(false);
  };

  const onEndReached = async () => {
    if (
      !loadingReviews &&
      !endOfDataList &&
      !refreshing &&
      !errorMsg &&
      product
    ) {
      const page = currentPage + 1;
      setCurrentPage(page);

      await fetchReviews(page, product._id);
    }
  };

  const fetchReviews = async (
    page: number,
    productId: string,
    reset?: boolean,
  ) => {
    try {
      setLoadingReviews(true);
      setErrorMsg(null);

      let prevReviews = [...reviews];

      if (reset) {
        prevReviews = [];
        page = 1;

        setReviews(prevReviews);
        setCurrentPage(page);
        setEndOfDataList(false);
      }

      console.log(prevReviews, page);

      const data = await reviewController.fetchReviews(page, productId);
      setReviews([...prevReviews, ...data]);

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
      setLoadingReviews(false);
    }
  };

  const postReview = async (description: string) => {
    try {
      await reviewController.postReview(description);

      await fetchReviews(currentPage, route.params.productId, true);
    } catch (error: any) {
      const status = error.response.status;
      const data = error.response.data;
      setErrorMsg(data.msg);

      if (status === 500) {
        setErrorMsg('Something went wrong, try refreshing');
      }
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const data = await productController.fetchSingleProduct(
        route.params.productId,
      );
      setProduct(data);

      if (data) {
        navigation.setOptions({title: truncate(data.title, 30, true)});

        await fetchReviews(currentPage, data._id, true);
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
    fetchProduct();
  }, []);
  return (
    <Box flex={1} px={3}>
      <FlatList
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        onRefresh={onRefresh}
        refreshing={refreshing}
        data={reviews}
        ListHeaderComponent={() => {
          return loading && !refreshing ? (
            <Box justifyContent="center">
              <Spinner py={3} color={theme.colors.gray[300]} size="lg" />
            </Box>
          ) : errorMsg ? (
            <Text my={3} color={theme.colors.red[600]} fontWeight="bold">
              {errorMsg}
            </Text>
          ) : product ? (
            <Box py={5}>
              <ImageGallery alt={product.title} images={product.images} />
              <StarRating productId={product._id} />
              <HStack space={1} mb={6} flexWrap="wrap">
                {product.categories_list.map(category => {
                  return (
                    <Box
                      key={category._id}
                      backgroundColor={theme.colors.yellow[200]}
                      py={1}
                      px={2}
                      borderRadius={10}>
                      <Text fontSize={12} color={theme.colors.yellow[700]}>
                        {category.name}
                      </Text>
                    </Box>
                  );
                })}
              </HStack>
              <Heading mb={6}>{product.title}</Heading>
              <Text fontWeight="bold" fontSize={14} mb={3}>
                Price - ${product.price / 100}
              </Text>
              {product.quantity && product.quantity > 0 ? (
                <Box>
                  {inCart(product._id) ? (
                    <Button
                      py={2}
                      mb={6}
                      onPress={() => removeItemFromCart(product._id)}>
                      <Text fontWeight="bold">Remove from Cart</Text>
                    </Button>
                  ) : (
                    <Box mb={6}>
                      <HStack space={2} mb={3}>
                        <Text fontWeight="bold" fontSize={14}>
                          Quantity -
                        </Text>
                        <Ionicons
                          name={'chevron-back-outline'}
                          size={24}
                          color={theme.colors.black}
                          onPress={() => deductQuantity()}
                        />
                        <Text fontSize={14}>
                          {selectedQuantity} / {product.quantity}
                        </Text>
                        <Ionicons
                          name={'chevron-forward-outline'}
                          size={24}
                          color={theme.colors.black}
                          onPress={() => addQuantity()}
                        />
                      </HStack>
                      <Button
                        py={2}
                        onPress={() =>
                          addItemToCart({...product, selectedQuantity})
                        }>
                        <Text fontWeight="bold">Add to Cart</Text>
                      </Button>
                    </Box>
                  )}
                </Box>
              ) : (
                <Heading
                  mb={3}
                  fontSize={14}
                  style={{color: theme.colors.red[500]}}>
                  Out of stock
                </Heading>
              )}

              <Heading mb={1} fontSize={14}>
                Description
              </Heading>
              <Text mb={10}>{product.description}</Text>
              <PostReview postReview={postReview} disabled={loadingReviews} />
              <Heading fontSize={20}>Product Reviews</Heading>
            </Box>
          ) : null;
        }}
        ListFooterComponent={
          <Box justifyContent="center">
            {endOfDataList ? (
              <Text pb={3} textAlign="center">
                You have reached the end of the list...
              </Text>
            ) : loadingReviews && !refreshing ? (
              <Spinner py={3} color={theme.colors.gray[300]} size="lg" />
            ) : null}
          </Box>
        }
        keyExtractor={(item, index) => item._id}
        renderItem={({item}) => <UserReview review={item} />}
      />
    </Box>
  );
};

export default ProductDetailsScreen;
