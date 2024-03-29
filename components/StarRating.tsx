import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Box, HStack, Pressable, Spinner, Text} from '@gluestack-ui/themed';
import {useContext, useEffect, useState, useCallback} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ErrorType, RootContext, getTokens} from '../context/RootContext';
import ratingController from '../controllers/ratingController';
import type {RootStackParamList} from '../stacks/RootStack';
import type {StackNavigationProp} from '@react-navigation/stack';
import {config} from '../config/gluestack-ui.config';

type Props = {
  rating: number;
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

const Rating = ({rating, productId}: Props) => {
  const route = useRoute<RouteProp<RootStackParamList>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {error, handleError, clearError, user} = useContext(RootContext);

  const [itemRating, setItemRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const submitRating = useCallback(
    async (score: number) => {
      try {
        setLoading(true);
        clearError(ErrorType.Form);

        const tokens = await getTokens();

        if (user && tokens.access) {
          const newRating = await ratingController.addRating(
            productId,
            score,
            tokens.access,
          );

          setItemRating(newRating);
        } else {
          navigation.navigate('Login');
        }
      } catch (error: any) {
        handleError(error, route.name, ErrorType.Form);
      } finally {
        setLoading(false);
      }
    },
    [user, error],
  );

  useEffect(() => {
    setItemRating(rating);
  }, []);

  return (
    <Box mb={4}>
      {loading ? (
        <Box justifyContent="center">
          <Spinner color="$coolGray300" size="large" />
        </Box>
      ) : (
        <HStack space="xs" alignItems="center">
          <HStack space="xs" mb="$2">
            <Pressable onPress={() => submitRating(1)} testID="one-star-rating">
              <Ionicons
                name={
                  itemRating >= 0.5
                    ? itemRating >= 1
                      ? 'star-sharp'
                      : 'star-half-sharp'
                    : 'star-outline'
                }
                size={24}
                color={config.tokens.colors.primary700}
              />
            </Pressable>
            <Pressable onPress={() => submitRating(2)} testID="two-star-rating">
              <Ionicons
                name={
                  itemRating >= 1.5
                    ? itemRating >= 2
                      ? 'star-sharp'
                      : 'star-half-sharp'
                    : 'star-outline'
                }
                size={24}
                color={config.tokens.colors.primary700}
              />
            </Pressable>
            <Pressable onPress={() => submitRating(3)}>
              <Ionicons
                testID="three-star-rating"
                name={
                  itemRating >= 2.5
                    ? itemRating >= 3
                      ? 'star-sharp'
                      : 'star-half-sharp'
                    : 'star-outline'
                }
                size={24}
                color={config.tokens.colors.primary700}
              />
            </Pressable>
            <Pressable
              onPress={() => submitRating(4)}
              testID="four-star-rating">
              <Ionicons
                name={
                  itemRating >= 3.5
                    ? itemRating >= 4
                      ? 'star-sharp'
                      : 'star-half-sharp'
                    : 'star-outline'
                }
                size={24}
                color={config.tokens.colors.primary700}
              />
            </Pressable>
            <Pressable
              onPress={() => submitRating(5)}
              testID="five-star-rating">
              <Ionicons
                name={
                  itemRating >= 4.5
                    ? itemRating >= 5
                      ? 'star-sharp'
                      : 'star-half-sharp'
                    : 'star-outline'
                }
                size={24}
                color={config.tokens.colors.primary700}
              />
            </Pressable>
          </HStack>
          <Text fontFamily="$heading" fontWeight="$normal" testID="rating">
            {itemRating}
          </Text>
        </HStack>
      )}
    </Box>
  );
};

export default Rating;
