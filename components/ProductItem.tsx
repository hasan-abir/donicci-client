import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';
import type {Category} from './CategoryItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  HStack,
  Pressable,
  Text,
  Image,
  Icon,
  useTheme,
  StarIcon,
} from '@gluestack-ui/themed';
import {config} from '../config/gluestack-ui.config';

interface Props {
  item: Product;
}

export interface ImageType {
  fileId: string;
  url: string;
}

export interface Product {
  _id: string;
  title: string;
  description?: string;
  images: ImageType[];
  price: number;
  user_rating: number;
  quantity?: number;
  categories_list?: Category[];
  category_ids?: string[];
  updated_at: string;
  created_at: string;
}

const ProductItem = ({item}: Props) => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList & RootTabParamList>>();

  return (
    <Pressable
      testID="card"
      display="flex"
      overflow="hidden"
      mb="$5"
      onPress={() =>
        navigation.navigate('ProductDetails', {productId: item._id})
      }>
      <Image
        size="md"
        w="$full"
        h="$80"
        borderRadius={20}
        mb="$3"
        backgroundColor="$secondary700"
        source={{
          uri: item.images[0].url,
        }}
        alt={item.title}
        testID={'product-image-' + item._id}
      />
      <HStack justifyContent="space-between" alignItems="flex-start" mb="$3">
        <Text fontSize="$xl" flex={1} testID={'product-title-' + item._id}>
          {item.title}
        </Text>
        <HStack ml="$2" alignItems="center">
          <Ionicons
            name="star-sharp"
            size={24}
            color={config.tokens.colors.secondary700}
          />
          <Text
            fontFamily="$heading"
            fontWeight="$normal"
            ml="$1"
            testID={'product-rating-' + item._id}>
            {item.user_rating}
          </Text>
        </HStack>
      </HStack>
      <Text
        fontFamily="$heading"
        fontWeight="$normal"
        testID={'product-price-' + item._id}>
        ${item.price / 100}
      </Text>
    </Pressable>
  );
};

export default ProductItem;
