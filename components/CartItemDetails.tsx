import {useContext} from 'react';
import {Box, Button, Heading, HStack, Image, Text, theme} from 'native-base';
import {CartItem, RootContext} from '../context/RootContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  item: CartItem;
};

const CartItemDetails = ({item}: Props) => {
  const {updateSelectedQuantity, removeItemFromCart} = useContext(RootContext);

  return (
    <Box
      borderColor={theme.colors.gray[300]}
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
      <Heading fontSize={14} mb={2}>
        {item.title}
      </Heading>

      <HStack space={2} mb={3}>
        <Text fontWeight="bold" fontSize={14}>
          Quantity -
        </Text>
        <Ionicons
          name={'chevron-back-outline'}
          size={24}
          color={theme.colors.black}
          onPress={() => updateSelectedQuantity(item._id, false)}
        />
        <Text fontSize={14}>
          {item.selectedQuantity} / {item.quantity}
        </Text>
        <Ionicons
          name={'chevron-forward-outline'}
          size={24}
          color={theme.colors.black}
          onPress={() => updateSelectedQuantity(item._id, true)}
        />
      </HStack>
      <HStack justifyContent="space-between">
        <Text fontWeight="bold" fontSize={14}>
          Price - ${item.price / 100}
        </Text>

        <Text fontWeight="bold" fontSize={14}>
          Total - $
          {Math.round((item.price / 100) * item.selectedQuantity * 100) / 100}
        </Text>
      </HStack>
    </Box>
  );
};

export default CartItemDetails;
