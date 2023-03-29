import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Box, Button, Divider, FlatList, Heading, Text} from 'native-base';
import {useContext} from 'react';
import CartItemDetails from '../components/CartItemDetails';
import {RootContext} from '../context/RootContext';
import type {RootTabParamList} from '../tabs/RootTab';

type Props = BottomTabScreenProps<RootTabParamList, 'Cart'>;

const CartScreen = (props: Props) => {
  const {cartItems, cartSum, clearCart} = useContext(RootContext);

  return (
    <Box flex={1} px={3}>
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => item._id}
        renderItem={({item}) => <CartItemDetails item={item} />}
        ListHeaderComponent={<Heading my={5}>Cart</Heading>}
        ListFooterComponent={() => {
          return cartItems.length > 0 ? (
            <Box>
              <Button
                colorScheme="danger"
                onPress={() => clearCart()}
                mt={8}
                mb={3}>
                Clear Cart
              </Button>
              <Text textTransform="uppercase" mb={3}>
                Subtotal: <Text fontWeight="bold">${cartSum.subTotal}</Text>
              </Text>
              <Text textTransform="uppercase">
                Tax: <Text fontWeight="bold">${cartSum.tax}</Text>
              </Text>
              <Divider my={3} />
              <Text mb={3} textTransform="uppercase">
                Total: <Text fontWeight="bold">${cartSum.total}</Text>
              </Text>
              <Button py={2} mb={5} onPress={() => clearCart()}>
                <Text fontWeight="bold">Purchase</Text>
              </Button>
            </Box>
          ) : (
            <Text>No items added yet</Text>
          );
        }}
      />
    </Box>
  );
};

export default CartScreen;
