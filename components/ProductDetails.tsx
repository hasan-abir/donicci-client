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
    <Box>
      <ImageGallery alt={product.title} images={product.images} />
      <StarRating productId={product._id} />
      <HStack space={1} mb={6} flexWrap="wrap">
        {product.categories_list.map(category => {
          return (
            <Box
              key={category._id}
              backgroundColor={colors.primary[400]}
              py={1}
              px={2}
              borderRadius={10}>
              <Text fontSize="sm" color={colors.primary[900]} fontWeight="bold">
                {category.name}
              </Text>
            </Box>
          );
        })}
      </HStack>
      <Heading mb={6}>{product.title}</Heading>
      <Text fontWeight="bold" fontSize="md" mb={3}>
        Price - ${product.price}
      </Text>
      {product.quantity && product.quantity > 0 ? (
        <Box>
          {inCart(product._id) ? (
            <Button
              py={2}
              mb={6}
              onPress={() => removeItemFromCart(product._id, route.name)}>
              <Text fontWeight="bold">Remove from Cart</Text>
            </Button>
          ) : (
            <Box mb={6}>
              <HStack space={2} mb={3}>
                <Text fontWeight="bold" fontSize="md">
                  Quantity -
                </Text>
                <Ionicons
                  name={'chevron-back-outline'}
                  size={24}
                  color={colors.black}
                  onPress={() => deductQuantity()}
                />
                <Text fontSize="md">
                  {selectedQuantity} / {product.quantity}
                </Text>
                <Ionicons
                  name={'chevron-forward-outline'}
                  size={24}
                  color={colors.black}
                  onPress={() => addQuantity()}
                />
              </HStack>
              <Button
                py={2}
                onPress={() =>
                  addItemToCart(product, selectedQuantity, route.name)
                }>
                <Text fontWeight="bold" fontSize="md">
                  Add to Cart
                </Text>
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <Heading mb={3} fontSize="md" style={{color: colors.red[500]}}>
          Out of stock
        </Heading>
      )}

      <Heading mb={1} fontSize="md">
        Description
      </Heading>
      <Text mb={10}>{product.description}</Text>
    </Box>
  );
};

export default ProductDetails;
