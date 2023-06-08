import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {
  AspectRatio,
  Box,
  HStack,
  Image,
  Pressable,
  Text,
  useTheme,
} from 'native-base';
import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';
import type {Category} from './CategoryItem';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  rating: number;
  quantity?: number;
  categories_list: Category[];
  category_ids: string[];
  updated_at: string;
  created_at: string;
}

const ProductItem = ({item}: Props) => {
  const {colors} = useTheme();

  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList & RootTabParamList>>();

  return (
    <Pressable
      testID="card"
      display="flex"
      overflow="hidden"
      mb={5}
      onPress={() =>
        navigation.navigate('ProductDetails', {productId: item._id})
      }>
      <AspectRatio ratio={{base: 4 / 3}}>
        <Image
          borderRadius={20}
          backgroundColor={colors.primary[100]}
          resizeMode="cover"
          mb={3}
          source={{uri: item.images[0].url}}
          alt={item.title}
        />
      </AspectRatio>
      <HStack justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Text fontFamily="body" fontSize="xl" flex={1}>
          {item.title}
        </Text>
        <HStack ml={2} alignItems="center">
          <Ionicons name="star-sharp" size={24} color={colors.primary[500]} />
          <Text fontFamily="body" fontWeight="bold" ml={1}>
            {item.rating}
          </Text>
        </HStack>
      </HStack>
      <Text fontFamily="body" fontWeight="bold">
        ${item.price}
      </Text>
    </Pressable>
  );
};

export default ProductItem;
