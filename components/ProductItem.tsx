import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {
  Divider,
  VStack,
  Pressable,
  Text,
  Heading,
  theme,
  Image,
  AspectRatio,
  HStack,
} from 'native-base';
import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';

type Props = {
  item: Product;
};

export type ImageType = {fileId: string; url: string};

export type Product = {
  _id: string;
  title: string;
  description?: string;
  images: ImageType[];
  price: number;
  quantity?: number;
};

const ProductItem = ({item}: Props) => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList & RootTabParamList>>();

  return (
    <Pressable
      display="flex"
      flexBasis="48%"
      borderColor={theme.colors.gray[300]}
      borderWidth={1}
      borderRadius={20}
      overflow="hidden"
      mb={3}
      onPress={() =>
        navigation.navigate('ProductDetails', {productId: item._id})
      }>
      <AspectRatio ratio={{base: 1 / 1}}>
        <Image
          resizeMode="cover"
          source={{uri: item.images[0].url}}
          alt={item.title}
        />
      </AspectRatio>
      <VStack flex={1} justifyContent="space-between" p={3}>
        <Heading fontSize={14} mb={3}>
          {item.title}
        </Heading>
        <Divider my={2} />
        <HStack justifyContent="space-between">
          <Text>Price</Text>
          <Text>${item.price / 100}</Text>
        </HStack>
      </VStack>
    </Pressable>
  );
};

export default ProductItem;
