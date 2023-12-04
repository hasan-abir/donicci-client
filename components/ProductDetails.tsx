import {
  Box,
  Button,
  ButtonText,
  Heading,
  HStack,
  Text,
} from '@gluestack-ui/themed';
import {useContext, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RootContext} from '../context/RootContext';
import ImageGallery from './ImageGallery';
import type {Product} from './ProductItem';
import StarRating from './StarRating';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../stacks/RootStack';
import {RootTabParamList} from '../tabs/RootTab';
import {config} from '../config/gluestack-ui.config';

interface Props {
  product: Product;
}

const ProductDetails = ({product}: Props) => {
  const route = useRoute<RouteProp<RootStackParamList & RootTabParamList>>();

  const {addItemToCart, removeItemFromCart, inCart} = useContext(RootContext);

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

  return (
    <Box mb="$8">
      <ImageGallery alt={product.title} images={product.images} />
      <Text
        fontWeight="$normal"
        fontFamily="$heading"
        fontSize="$md"
        mt="$6"
        mb="$3"
        testID="price">
        ${product.price}
      </Text>
      <Text mb="$6" fontSize="$xl" testID="title">
        {product.title}
      </Text>
      <HStack space="sm" mb="$6" flexWrap="wrap">
        {product.categories_list &&
          product.categories_list.map(category => {
            return (
              <Box
                key={category._id}
                backgroundColor="$secondary100"
                py="$1"
                px="$3"
                borderRadius="$sm">
                <Text
                  fontSize="$sm"
                  color="$secondary700"
                  fontFamily="$heading"
                  fontWeight="$normal"
                  testID={'category-' + category._id}>
                  {category.name}
                </Text>
              </Box>
            );
          })}
      </HStack>
      <StarRating rating={product.user_rating} productId={product._id} />
      {product.quantity && product.quantity > 0 ? (
        <Box mb="$6">
          {inCart(product._id) ? (
            <Button
              py="$2"
              px="$6"
              borderRadius="$sm"
              onPress={() => removeItemFromCart(product._id, route.name)}
              bgColor="$secondary700"
              testID="remove-from-cart">
              <ButtonText fontFamily="$heading" fontWeight="$normal">
                REMOVE FROM CART
              </ButtonText>
            </Button>
          ) : (
            <HStack space="sm" justifyContent="space-between">
              <HStack space="xs" alignItems="center">
                <Text>Quantity</Text>
                <Ionicons
                  testID="decrease-quantity"
                  name={'chevron-back-outline'}
                  size={24}
                  color={config.tokens.colors.black}
                  onPress={() => deductQuantity()}
                />
                <Text testID="quantity">
                  {selectedQuantity} of {product.quantity}
                </Text>
                <Ionicons
                  testID="increase-quantity"
                  name={'chevron-forward-outline'}
                  size={24}
                  color={config.tokens.colors.black}
                  onPress={() => addQuantity()}
                />
              </HStack>
              <Button
                py="$2"
                px="$6"
                borderRadius="$sm"
                onPress={() =>
                  addItemToCart(product, selectedQuantity, route.name)
                }
                bgColor="$secondary700"
                testID="add-to-cart">
                <ButtonText fontFamily="$heading" fontWeight="$normal">
                  ADD TO CART
                </ButtonText>
              </Button>
            </HStack>
          )}
        </Box>
      ) : (
        <Heading
          mb="$6"
          fontSize="$md"
          fontFamily="body"
          color="$error600"
          testID="out-of-stock">
          Out of stock
        </Heading>
      )}

      <Text mb="$2" fontSize="$md">
        Description
      </Text>
      <Text color="$coolGray500" testID="description">
        {product.description}
      </Text>
    </Box>
  );
};

export default ProductDetails;
