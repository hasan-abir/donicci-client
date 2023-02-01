import type {StackScreenProps} from '@react-navigation/stack';
import {
  AspectRatio,
  Button,
  Box,
  Heading,
  HStack,
  Image,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  theme,
} from 'native-base';
import {useContext, useEffect, useState} from 'react';
import type {Product} from '../components/ProductItem';
import type {RootStackParamList} from '../stacks/RootStack';
// temporary
import demoProducts from '../components/demoProducts.json';
import type {ImageType} from '../components/ProductItem';
import {RootContext} from '../context/RootContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = StackScreenProps<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen = ({route, navigation}: Props) => {
  const {addItemToCart, removeItemFromCart, inCart} = useContext(RootContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [imageSelected, setImageSelected] = useState<ImageType | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

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

  useEffect(() => {
    const foundProduct = demoProducts.products.find(
      item => item._id === route.params.productId,
    ) as Product;
    setProduct(foundProduct);
    if (foundProduct) {
      setImageSelected(foundProduct.images[0]);
    }

    navigation.setOptions({title: ' '});
  }, [navigation]);
  return (
    <Box flex={1} py={5} px={3}>
      <ScrollView>
        {loading ? (
          <Box justifyContent="center">
            <Spinner color={theme.colors.gray[300]} size="lg" />
          </Box>
        ) : null}
        {product ? (
          <Box>
            {imageSelected ? (
              <AspectRatio
                backgroundColor={theme.colors.yellow[50]}
                borderRadius={5}
                ratio={{base: 1 / 1}}>
                <Image
                  resizeMode="contain"
                  source={{uri: imageSelected.url}}
                  alt={product.title}
                />
              </AspectRatio>
            ) : null}
            <HStack space={2} mt={3} mb={6}>
              {product.images.map(image => {
                return (
                  <Pressable
                    key={image.url}
                    borderColor={
                      imageSelected && image.url === imageSelected.url
                        ? 'yellow.400'
                        : null
                    }
                    borderWidth={
                      imageSelected && image.url === imageSelected.url
                        ? 2
                        : null
                    }
                    onPress={() => setImageSelected(image)}>
                    <Image
                      size="sm"
                      source={{uri: image.url}}
                      alt={product.title}
                    />
                  </Pressable>
                );
              })}
            </HStack>
            <Heading mb={6}>{product.title}</Heading>
            <Text fontWeight="bold" fontSize={14} mb={3}>
              Price - ${product.price / 100}
            </Text>
            {product.quantity && product.quantity > 0 ? (
              <Box>
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
                {inCart(product._id) ? (
                  <Button
                    py={2}
                    mb={6}
                    onPress={() => removeItemFromCart(product._id)}>
                    <Text fontWeight="bold">Remove from Cart</Text>
                  </Button>
                ) : (
                  <Button
                    py={2}
                    mb={6}
                    onPress={() =>
                      addItemToCart({...product, selectedQuantity})
                    }>
                    <Text fontWeight="bold">Add to Cart</Text>
                  </Button>
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
            <Text>{product.description}</Text>
          </Box>
        ) : null}
      </ScrollView>
    </Box>
  );
};

export default ProductDetailsScreen;
