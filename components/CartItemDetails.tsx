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
    <Box backgroundColor={colors.white} mt={4} p={5} borderRadius={10}>
      <HStack mb={3} space={3}>
        <Image
          size="sm"
          backgroundColor={colors.primary[500]}
          source={{uri: item.product.images[0].url}}
          alt={item.product.title}
          borderRadius={100}
        />

        <Text flex={1} fontFamily="body">
          {item.product.title}
        </Text>
      </HStack>
      <HStack justifyContent="space-between" alignItems="center" mb={4}>
        <HStack space={1} alignItems="center">
          <Text fontFamily="body">Quantity</Text>
          <Ionicons
            testID="decrease-quantity"
            name={'chevron-back-outline'}
            size={24}
            color={colors.black}
            onPress={() => updateSelectedQuantity(item._id, false)}
          />
          <Text>
            {item.selectedQuantity} of {item.product.quantity}
          </Text>
          <Ionicons
            testID="increase-quantity"
            name={'chevron-forward-outline'}
            size={24}
            color={colors.black}
            onPress={() => updateSelectedQuantity(item._id, true)}
          />
        </HStack>
        <HStack space={2} alignItems="center">
          <Text fontFamily="body">Price</Text>
          <Text fontFamily="body" fontWeight="bold">
            ${item.product.price}
          </Text>
        </HStack>
      </HStack>

      <HStack space={2} alignItems="center">
        <Text fontFamily="body">Total</Text>
        <Text fontFamily="body" fontWeight="bold">
          ${Math.round(item.product.price * item.selectedQuantity * 100) / 100}
        </Text>
      </HStack>
      <Button
        size="sm"
        position="absolute"
        bottom={-6}
        right={2}
        px={2}
        py={1}
        colorScheme="danger"
        _text={{
          fontFamily: 'body',
          fontWeight: 'bold',
        }}
        onPress={() => removeItemFromCart(item.product._id, route.name)}>
        REMOVE
      </Button>
    </Box>
  );
};

export default CartItemDetails;
