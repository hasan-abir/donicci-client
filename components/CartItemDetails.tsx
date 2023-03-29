import {Box, Button, HStack, Image, Text, useTheme} from 'native-base';
import {useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CartItem, RootContext} from '../context/RootContext';

type Props = {
  item: CartItem;
};

const CartItemDetails = ({item}: Props) => {
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
          source={{uri: item.images[0].url}}
          alt={item.title}
          borderRadius={100}
        />
        <HStack flex={1} justifyContent="flex-end">
          <Button
            size="xs"
            colorScheme="danger"
            onPress={() => removeItemFromCart(item._id)}>
            Remove
          </Button>
        </HStack>
      </HStack>
      <Text fontSize="md" mb={5}>
        {item.title}
      </Text>

      <HStack space={2} mb={3}>
        <Text fontWeight="bold" fontSize="sm">
          Quantity -
        </Text>
        <Ionicons
          name={'chevron-back-outline'}
          size={24}
          color={colors.black}
          onPress={() => updateSelectedQuantity(item._id, false)}
        />
        <Text fontSize="sm">
          {item.selectedQuantity} / {item.quantity}
        </Text>
        <Ionicons
          name={'chevron-forward-outline'}
          size={24}
          color={colors.black}
          onPress={() => updateSelectedQuantity(item._id, true)}
        />
      </HStack>
      <HStack justifyContent="space-between">
        <Text fontWeight="bold" fontSize="sm">
          Price - ${item.price}
        </Text>

        <Text fontWeight="bold" fontSize="sm">
          Total - ${Math.round(item.price * item.selectedQuantity * 100) / 100}
        </Text>
      </HStack>
    </Box>
  );
};

export default CartItemDetails;
