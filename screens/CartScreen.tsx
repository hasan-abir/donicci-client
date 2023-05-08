import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  Box,
  Button,
  Divider,
  FlatList,
  Heading,
  Spinner,
  Text,
  useTheme,
} from 'native-base';
import {useContext, useEffect, useState, useCallback, memo} from 'react';
import CartItemDetails from '../components/CartItemDetails';
import {CartItem, RootContext} from '../context/RootContext';
import type {RootTabParamList} from '../tabs/RootTab';
import cartItemController from '../controllers/cartItemController';

type Props = BottomTabScreenProps<RootTabParamList, 'Cart'>;

const areEqual = (prevProps: {item: CartItem}, nextProps: {item: CartItem}) =>
  prevProps.item === nextProps.item;
const PureCartItemDetails = memo(CartItemDetails, areEqual);

const CartScreen = ({route}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    cartItems,
    cartSum,
    clearCart,
    user,
    handleError,
    token,
    setCartItems,
    calculateTheTotals,
  } = useContext(RootContext);
  const {colors} = useTheme();

  const fetchUserCartItems = useCallback(async () => {
    if (user && token) {
      try {
        setLoading(true);
        clearCart();

        const userItems = await cartItemController.fetchCartItems(token);

        setCartItems(userItems);
        calculateTheTotals(userItems);
      } catch (error: any) {
        handleError(error, route.name);
      } finally {
        setLoading(false);
      }
    }
  }, [user, token]);

  useEffect(() => {
    fetchUserCartItems();
  }, [user, token]);
  return (
    <Box flex={1} px={3}>
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => item._id}
        renderItem={({item}) => <PureCartItemDetails item={item} />}
        ListHeaderComponent={<Heading my={5}>Cart</Heading>}
        ListFooterComponent={() => {
          if (loading) {
            return (
              <Box alignItems="center" justifyContent="center" flex={1}>
                <Spinner py={3} color={colors.gray[300]} size="lg" />
              </Box>
            );
          } else if (cartItems.length > 0) {
            return (
              <Box>
                <Button
                  colorScheme="danger"
                  onPress={() => clearCart()}
                  mt={8}
                  mb={3}>
                  Clear Cart
                </Button>
                <Text textTransform="uppercase" mb={3}>
                  <Text>Subtotal: </Text>
                  <Text fontWeight="bold">${cartSum.subTotal}</Text>
                </Text>
                <Text textTransform="uppercase">
                  <Text>Tax: </Text>
                  <Text fontWeight="bold">${cartSum.tax}</Text>
                </Text>
                <Divider my={3} />
                <Text mb={3} textTransform="uppercase">
                  <Text>Total: </Text>
                  <Text fontWeight="bold">${cartSum.total}</Text>
                </Text>
                <Button py={2} mb={5} onPress={() => clearCart()}>
                  <Text fontWeight="bold">Purchase</Text>
                </Button>
              </Box>
            );
          } else {
            return <Text>No items added yet</Text>;
          }
        }}
      />
    </Box>
  );
};

export default CartScreen;
