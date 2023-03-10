import {useState, useEffect} from 'react';
import {Box, HStack, Pressable, Spinner, Text, theme} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ratingController from '../controllers/ratingController';

type Props = {
  productId: string;
};

export type Rating = {
  _id: string;
  score: number;
  product_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

const Rating = ({productId}: Props) => {
  const [itemRating, setItemRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const submitRating = async (score: number) => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const rating = await ratingController.addRating(productId, score);

      setItemRating(rating);
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

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const rating = await ratingController.fetchRatings(productId);

      setItemRating(rating);
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
    fetchData();
  }, []);

  return (
    <Box mb={4}>
      {errorMsg ? (
        <Text my={3} color={theme.colors.red[600]} fontWeight="bold">
          {errorMsg}
        </Text>
      ) : null}
      {loading ? (
        <Box justifyContent="center">
          <Spinner color={theme.colors.gray[300]} size="lg" />
        </Box>
      ) : (
        <Box>
          <HStack space={1} mb={2}>
            <Pressable onPress={() => submitRating(1)}>
              <Ionicons
                name={
                  itemRating >= 0.5
                    ? itemRating >= 1
                      ? 'star-sharp'
                      : 'star-half-sharp'
                    : 'star-outline'
                }
                size={24}
                color={theme.colors.yellow[500]}
              />
            </Pressable>
            <Pressable onPress={() => submitRating(2)}>
              <Ionicons
                name={
                  itemRating >= 1.5
                    ? itemRating >= 2
                      ? 'star-sharp'
                      : 'star-half-sharp'
                    : 'star-outline'
                }
                size={24}
                color={theme.colors.yellow[500]}
              />
            </Pressable>
            <Pressable onPress={() => submitRating(3)}>
              <Ionicons
                name={
                  itemRating >= 2.5
                    ? itemRating >= 3
                      ? 'star-sharp'
                      : 'star-half-sharp'
                    : 'star-outline'
                }
                size={24}
                color={theme.colors.yellow[500]}
              />
            </Pressable>
            <Pressable onPress={() => submitRating(4)}>
              <Ionicons
                name={
                  itemRating >= 3.5
                    ? itemRating >= 4
                      ? 'star-sharp'
                      : 'star-half-sharp'
                    : 'star-outline'
                }
                size={24}
                color={theme.colors.yellow[500]}
              />
            </Pressable>
            <Pressable onPress={() => submitRating(5)}>
              <Ionicons
                name={
                  itemRating >= 4.5
                    ? itemRating >= 5
                      ? 'star-sharp'
                      : 'star-half-sharp'
                    : 'star-outline'
                }
                size={24}
                color={theme.colors.yellow[500]}
              />
            </Pressable>
          </HStack>
          <Text color={theme.colors.gray[400]}>Rating - {itemRating}</Text>
        </Box>
      )}
    </Box>
  );
};

export default Rating;
