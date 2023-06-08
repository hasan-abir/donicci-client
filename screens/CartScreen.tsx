import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  Box,
  Button,
  Divider,
  FlatList,
  HStack,
  Spinner,
  Text,
  VStack,
  useTheme,
} from 'native-base';
import {memo, useCallback, useContext, useEffect, useState} from 'react';
import CartItemDetails from '../components/CartItemDetails';
import {CartItem, RootContext} from '../context/RootContext';
import cartItemController from '../controllers/cartItemController';
import type {RootTabParamList} from '../tabs/RootTab';

interface Props extends BottomTabScreenProps<RootTabParamList, 'Cart'> {}

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
    <Box flex={1}>
      <FlatList
        px={6}
        borderColor="red.500"
        borderWidth={1}
        data={cartItems}
        keyExtractor={(item, index) => item._id}
        renderItem={({item}) => <PureCartItemDetails item={item} />}
        ListFooterComponent={() => (
          <Box justifyContent="center">
            {loading ? (
              <Spinner color={colors.gray[300]} size="lg" />
            ) : cartItems.length > 0 ? (
              <Box>
                <VStack
                  backgroundColor={colors.white}
                  mt={4}
                  p={5}
                  borderRadius={10}
                  space={2}>
                  <HStack alignItems="center" justifyContent="space-between">
                    <Text fontFamily="body">Sub Total</Text>
                    <Text fontFamily="body">${cartSum.subTotal}</Text>
                  </HStack>
                  <HStack alignItems="center" justifyContent="space-between">
                    <Text fontFamily="body">Tax</Text>
                    <Text fontFamily="body">${cartSum.tax}</Text>
                  </HStack>
                  <Divider />
                  <HStack alignItems="center" justifyContent="space-between">
                    <Text fontFamily="body">Total</Text>
                    <Text fontFamily="body" fontSize="xl">
                      ${cartSum.total}
                    </Text>
                  </HStack>
                </VStack>
                <Button
                  py={2}
                  onPress={() => clearCart()}
                  mt={6}
                  mb={3}
                  bgColor={colors.secondary[500]}
                  _text={{fontFamily: 'body', fontWeight: 'bold'}}>
                  Purchase
                </Button>
                <Button
                  mb={6}
                  colorScheme="danger"
                  onPress={() => clearCart()}
                  _text={{fontFamily: 'body', fontWeight: 'bold'}}>
                  Clear Cart
                </Button>
              </Box>
            ) : (
              <Text fontFamily="body">No items added yet</Text>
            )}
          </Box>
        )}
      />
    </Box>
  );
};

export default CartScreen;
