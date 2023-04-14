import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Box, HStack, Pressable, Spinner, Text, useTheme} from 'native-base';
import {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RootContext} from '../context/RootContext';
import ratingController from '../controllers/ratingController';
import type {RootStackParamList} from '../stacks/RootStack';
import type {StackNavigationProp} from '@react-navigation/stack';

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
  const route = useRoute<RouteProp<RootStackParamList>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {handleError, clearError, user, token} = useContext(RootContext);
  const {colors} = useTheme();

  const [itemRating, setItemRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const submitRating = async (score: number) => {
    try {
      setLoading(true);
      clearError();

      if (user && token) {
        const rating = await ratingController.addRating(
          productId,
          score,
          token,
        );

        setItemRating(rating);
      } else {
        navigation.navigate('Login');
      }
    } catch (error: any) {
      handleError(error, route.name);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      clearError();

      const rating = await ratingController.fetchRatings(productId);

      setItemRating(rating);
    } catch (error: any) {
      handleError(error, route.name);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box mb={4}>
      {loading ? (
        <Box justifyContent="center">
          <Spinner color={colors.gray[300]} size="lg" />
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
                color={colors.primary[500]}
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
                color={colors.primary[500]}
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
                color={colors.primary[500]}
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
                color={colors.primary[500]}
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
                color={colors.primary[500]}
              />
            </Pressable>
          </HStack>
          <Text color={colors.gray[400]}>Rating - {itemRating}</Text>
        </Box>
      )}
    </Box>
  );
};

export default Rating;
