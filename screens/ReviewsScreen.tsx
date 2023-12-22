import type {StackScreenProps} from '@react-navigation/stack';
import {Box, FlatList, Spinner, Text} from '@gluestack-ui/themed';
import {memo, useCallback, useContext, useEffect, useState} from 'react';
import PostReview from '../components/PostReview';
import type {Review} from '../components/UserReview';
import UserReview from '../components/UserReview';
import {ErrorType, RootContext, getTokens} from '../context/RootContext';
import reviewController from '../controllers/reviewController';
import type {RootStackParamList} from '../stacks/RootStack';

interface Props extends StackScreenProps<RootStackParamList, 'Reviews'> {}

const areEqual = (prevProps: {review: Review}, nextProps: {review: Review}) =>
  prevProps.review === nextProps.review;
const PureUserReview = memo(UserReview, areEqual);

const ReviewsScreen = ({route, navigation}: Props) => {
  const {error, handleError, clearError, user} = useContext(RootContext);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean | undefined>(undefined);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [endOfDataList, setEndOfDataList] = useState<boolean>(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReviews(lastUpdatedAt, route.params.productId, true);
    setRefreshing(false);
  }, [lastUpdatedAt, route]);

  const onEndReached = useCallback(async () => {
    if (!loading && !endOfDataList && !refreshing && !error) {
      await fetchReviews(lastUpdatedAt, route.params.productId);
    }
  }, [loading, endOfDataList, refreshing, error, lastUpdatedAt, route]);

  const fetchReviews = useCallback(
    async (next: string | undefined, productId: string, reset?: boolean) => {
      navigation.setOptions({title: 'Reviews'});

      try {
        setLoading(true);
        clearError(ErrorType.Fetch);

        let prevReviews = [...reviews];

        if (reset) {
          prevReviews = [];
          next = undefined;

          setReviews(prevReviews);
          setLastUpdatedAt(next);
          setEndOfDataList(false);
        }

        const data = await reviewController.fetchReviews(productId, next);
        setReviews([...prevReviews, ...data]);

        if (data.length > 0) {
          setLastUpdatedAt(data[data.length - 1].updated_at);
        } else {
          setEndOfDataList(true);
        }
      } catch (error: any) {
        handleError(error, route.name, ErrorType.Fetch);
      } finally {
        setLoading(undefined);
      }
    },
    [reviews],
  );

  const postReview = useCallback(
    async (description: string) => {
      try {
        clearError(ErrorType.Form);

        const tokens = await getTokens();
        if (user && tokens.access) {
          const newReview = await reviewController.postReview(
            description,
            route.params.productId,
            tokens.access,
          );

          setReviews([newReview, ...reviews]);
        } else {
          navigation.navigate('Login');
        }
      } catch (error: any) {
        handleError(error, route.name, ErrorType.Form);
      }
    },
    [user, route, reviews, error],
  );

  useEffect(() => {
    fetchReviews(lastUpdatedAt, route.params.productId, true);
  }, []);
  return (
    <Box flex={1}>
      <FlatList
        px="$6"
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        onRefresh={onRefresh}
        refreshing={refreshing}
        data={reviews}
        testID="flat-list"
        ListHeaderComponent={() => {
          return (
            <Box mt="$6">
              <PostReview postReview={postReview} disabled={loading} />
              <Text mb="$6" fontSize="$xl" testID="reviews-heading">
                User Reviews
              </Text>
            </Box>
          );
        }}
        ListFooterComponent={
          <Box justifyContent="center" mb="$6">
            {loading && !refreshing ? (
              <Spinner color="$coolGray300" size="large" />
            ) : reviews.length < 1 ? (
              <Text textAlign="center" testID="no-data-text">
                No reviews found...
              </Text>
            ) : endOfDataList ? (
              <Text textAlign="center" testID="end-of-data-text">
                That's all for now!
              </Text>
            ) : null}
          </Box>
        }
        keyExtractor={(item, index) => (item as Review)._id}
        renderItem={({item}) => <PureUserReview review={item as Review} />}
      />
    </Box>
  );
};

export default ReviewsScreen;
