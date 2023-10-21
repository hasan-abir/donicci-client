import {Box, Button, Heading, HStack, Text, useTheme} from 'native-base';
import {useContext, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RootContext} from '../context/RootContext';
import ImageGallery from './ImageGallery';
import type {Product} from './ProductItem';
import StarRating from './StarRating';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../stacks/RootStack';
import {RootTabParamList} from '../tabs/RootTab';

interface Props {
  product: Product;
}

const ProductDetails = ({product}: Props) => {
  const route = useRoute<RouteProp<RootStackParamList & RootTabParamList>>();

  const {colors} = useTheme();
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
    <Box mb={8}>
      <ImageGallery alt={product.title} images={product.images} />
      <Text
        fontWeight="bold"
        fontFamily="body"
        fontSize="md"
        mt={6}
        mb={3}
        testID="price">
        ${product.price}
      </Text>
      <Text fontFamily="body" mb={6} fontSize="xl" testID="title">
        {product.title}
      </Text>
      <HStack space={2} mb={6} flexWrap="wrap">
        {product.categories_list &&
          product.categories_list.map(category => {
            return (
              <Box
                key={category._id}
                backgroundColor={colors.secondary[100]}
                py={1}
                px={3}
                borderRadius={10}>
                <Text
                  fontSize="sm"
                  color={colors.secondary[500]}
                  fontWeight="bold"
                  testID={'category-' + category._id}>
                  {category.name}
                </Text>
              </Box>
            );
          })}
      </HStack>
      <StarRating rating={product.user_rating} productId={product._id} />
      {product.quantity && product.quantity > 0 ? (
        <Box mb={6}>
          {inCart(product._id) ? (
            <Button
              py={2}
              px={6}
              borderRadius={20}
              onPress={() => removeItemFromCart(product._id, route.name)}
              bgColor={colors.secondary[500]}
              _text={{fontFamily: 'body', fontWeight: 'bold'}}
              testID="remove-from-cart">
              REMOVE FROM CART
            </Button>
          ) : (
            <HStack space={2} justifyContent="space-between">
              <HStack space={1} alignItems="center">
                <Text fontFamily="body">Quantity</Text>
                <Ionicons
                  testID="decrease-quantity"
                  name={'chevron-back-outline'}
                  size={24}
                  color={colors.black}
                  onPress={() => deductQuantity()}
                />
                <Text fontFamily="body" testID="quantity">
                  {selectedQuantity} of {product.quantity}
                </Text>
                <Ionicons
                  testID="increase-quantity"
                  name={'chevron-forward-outline'}
                  size={24}
                  color={colors.black}
                  onPress={() => addQuantity()}
                />
              </HStack>
              <Button
                py={2}
                px={6}
                borderRadius={20}
                onPress={() =>
                  addItemToCart(product, selectedQuantity, route.name)
                }
                bgColor={colors.secondary[500]}
                _text={{fontFamily: 'body', fontWeight: 'bold'}}
                testID="add-to-cart">
                ADD TO CART
              </Button>
            </HStack>
          )}
        </Box>
      ) : (
        <Heading
          mb={6}
          fontSize="md"
          fontFamily="body"
          style={{color: colors.danger[600]}}
          testID="out-of-stock">
          Out of stock
        </Heading>
      )}

      <Text mb={2} fontSize="md" fontFamily="body">
        Description
      </Text>
      <Text color={colors.gray[500]} fontFamily="body" testID="description">
        {product.description}
      </Text>
    </Box>
  );
};

export default ProductDetails;
