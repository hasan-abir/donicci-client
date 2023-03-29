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
      display="flex"
      borderColor={colors.gray[300]}
      borderWidth={1}
      borderRadius={20}
      overflow="hidden"
      mb={3}
      onPress={() =>
        navigation.navigate('ProductDetails', {productId: item._id})
      }>
      <AspectRatio ratio={{base: 4 / 3}}>
        <Image
          resizeMode="cover"
          source={{uri: item.images[0].url}}
          alt={item.title}
        />
      </AspectRatio>
      <HStack
        space={2}
        justifyContent="space-between"
        alignItems="center"
        p={3}>
        <Text flex={1} fontSize="md" mb={3}>
          {item.title}
        </Text>
        <Box backgroundColor={colors.primary[400]} px={1} borderRadius="md">
          <Text fontWeight="bold" color={colors.primary[900]}>
            ${item.price}
          </Text>
        </Box>
      </HStack>
    </Pressable>
  );
};

export default ProductItem;
