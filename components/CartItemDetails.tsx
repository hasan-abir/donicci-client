import {
  Box,
  Button,
  ButtonText,
  HStack,
  Image,
  Text,
} from '@gluestack-ui/themed';
import {useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CartItem, RootContext} from '../context/RootContext';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootTabParamList} from '../tabs/RootTab';
import {config} from '../config/gluestack-ui.config';

type Props = {
  item: CartItem;
};

const CartItemDetails = ({item}: Props) => {
  const route = useRoute<RouteProp<RootTabParamList>>();

  const {updateSelectedQuantity, removeItemFromCart} = useContext(RootContext);

  return (
    <Box backgroundColor="$white" mb="$4" p="$5" borderRadius="$lg">
      <HStack mb="$3" space="sm">
        <Image
          size="sm"
          backgroundColor="$primary700"
          source={{uri: item.product_image.url}}
          alt={item.product_title}
          borderRadius={100}
        />

        <Text flex={1} testID={'item-' + item.product_id + '-title'}>
          {item.product_title}
        </Text>
      </HStack>
      <HStack justifyContent="space-between" alignItems="center" mb="$4">
        <HStack space="xs" alignItems="center">
          <Text>Quantity</Text>
          <Ionicons
            testID={'item-' + item.product_id + '-decrease-quantity'}
            name={'chevron-back-outline'}
            size={24}
            color={config.tokens.colors.black}
            onPress={() => updateSelectedQuantity(item._id, false)}
          />
          <Text color="$black" testID={'item-' + item.product_id + '-quantity'}>
            {item.selected_quantity} of {item.product_quantity}
          </Text>
          <Ionicons
            testID={'item-' + item.product_id + '-increase-quantity'}
            name={'chevron-forward-outline'}
            size={24}
            color={config.tokens.colors.black}
            onPress={() => updateSelectedQuantity(item._id, true)}
          />
        </HStack>
        <HStack space="xs" alignItems="center">
          <Text>Price</Text>
          <Text fontFamily="$heading" fontWeight="$normal" color="$black">
            ${item.product_price}
          </Text>
        </HStack>
      </HStack>

      <HStack space="xs" alignItems="center">
        <Text>Total</Text>
        <Text
          fontFamily="$heading"
          fontWeight="$normal"
          color="$black"
          testID={'item-' + item.product_id + '-total'}>
          ${Math.round(item.product_price * item.selected_quantity * 100) / 100}
        </Text>
      </HStack>
      <Button
        size="sm"
        position="absolute"
        bottom={-6}
        right={6}
        px="$2"
        py="$1"
        backgroundColor="$error600"
        onPress={() => removeItemFromCart(item.product_id, route.name)}
        testID={'item-' + item.product_id + '-remove'}>
        <ButtonText fontFamily="$heading" fontWeight="$normal">
          REMOVE
        </ButtonText>
      </Button>
    </Box>
  );
};

export default CartItemDetails;
