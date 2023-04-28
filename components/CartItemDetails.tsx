import {Box, Button, HStack, Image, Text, useTheme} from 'native-base';
import {useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CartItem, RootContext} from '../context/RootContext';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootTabParamList} from '../tabs/RootTab';

type Props = {
  item: CartItem;
};

const CartItemDetails = ({item}: Props) => {
  const route = useRoute<RouteProp<RootTabParamList>>();

  const {updateSelectedQuantity, removeItemFromCart} = useContext(RootContext);
  const {colors} = useTheme();

  return (
    <Box
      borderColor={colors.gray[300]}
      borderWidth={1}
      borderRadius={20}
      mb={3}
      p={3}
      overflow="hidden">
      <HStack mb={3} alignItems="flex-start">
        <Image
          size="sm"
          source={{uri: item.product.images[0].url}}
          alt={item.product.title}
          borderRadius={100}
        />
        <HStack flex={1} justifyContent="flex-end">
          <Button
            size="xs"
            colorScheme="danger"
            onPress={() => removeItemFromCart(item.product._id, route.name)}>
            Remove
          </Button>
        </HStack>
      </HStack>
      <Text fontSize="md" mb={5}>
        {item.product.title}
      </Text>

      <HStack space={2} mb={3}>
        <Text fontWeight="bold" fontSize="sm">
          Quantity -
        </Text>
        <Ionicons
          testID="decrease-quantity"
          name={'chevron-back-outline'}
          size={24}
          color={colors.black}
          onPress={() => updateSelectedQuantity(item._id, false)}
        />
        <Text fontSize="sm">
          {item.selectedQuantity} / {item.product.quantity}
        </Text>
        <Ionicons
          testID="increase-quantity"
          name={'chevron-forward-outline'}
          size={24}
          color={colors.black}
          onPress={() => updateSelectedQuantity(item._id, true)}
        />
      </HStack>
      <HStack justifyContent="space-between">
        <Text fontWeight="bold" fontSize="sm">
          Price - ${item.product.price}
        </Text>

        <Text fontWeight="bold" fontSize="sm">
          Total - $
          {Math.round(item.product.price * item.selectedQuantity * 100) / 100}
        </Text>
      </HStack>
    </Box>
  );
};

export default CartItemDetails;
