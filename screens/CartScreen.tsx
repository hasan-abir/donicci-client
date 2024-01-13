import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  Box,
  Button,
  ButtonText,
  Divider,
  FlatList,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import {memo, useCallback, useContext, useEffect, useState} from 'react';
import CartItemDetails from '../components/CartItemDetails';
import {
  CartItem,
  ErrorType,
  RootContext,
  getTokens,
} from '../context/RootContext';
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
    setCartItems,
    calculateTheTotals,
  } = useContext(RootContext);

  const fetchUserCartItems = useCallback(async () => {
    const tokens = await getTokens();

    if (user && tokens.access) {
      try {
        setLoading(true);

        const userItems = await cartItemController.fetchCartItems(
          tokens.access,
        );

        setCartItems(userItems);
        calculateTheTotals(userItems);
      } catch (error: any) {
        handleError(error, route.name, ErrorType.Fetch);
      } finally {
        setLoading(false);
      }
    }
  }, [user, cartItems]);

  useEffect(() => {
    fetchUserCartItems();
  }, [user]);
  return (
    <Box flex={1}>
      <FlatList
        px="$6"
        data={cartItems}
        keyExtractor={item => (item as CartItem)._id}
        renderItem={({item}) => <PureCartItemDetails item={item as CartItem} />}
        testID="flat-list"
        ListFooterComponent={() => (
          <Box justifyContent="center" my="$6">
            {loading ? (
              <Spinner color="$coolGray300" size="large" />
            ) : cartItems.length > 0 ? (
              <Box>
                <VStack
                  backgroundColor="$white"
                  mt="$4"
                  p="$5"
                  borderRadius="$sm"
                  space="sm">
                  <HStack alignItems="center" justifyContent="space-between">
                    <Text>Sub Total</Text>
                    <Text testID="subtotal">${cartSum.subTotal / 100}</Text>
                  </HStack>
                  <HStack alignItems="center" justifyContent="space-between">
                    <Text>Tax</Text>
                    <Text testID="tax">${cartSum.tax / 100}</Text>
                  </HStack>
                  <Divider />
                  <HStack alignItems="center" justifyContent="space-between">
                    <Text>Total</Text>
                    <Text
                      fontSize="$xl"
                      fontFamily="$heading"
                      fontWeight="$normal"
                      color="$black"
                      testID="total">
                      ${cartSum.total / 100}
                    </Text>
                  </HStack>
                </VStack>
                <Button
                  py="$2"
                  onPress={() => clearCart(route.name)}
                  mt="$6"
                  mb="$4"
                  bgColor="$secondary700">
                  <ButtonText fontFamily="$heading" fontWeight="$normal">
                    PURCHASE
                  </ButtonText>
                </Button>
                <Button
                  onPress={() => clearCart(route.name)}
                  bgColor="$error600"
                  testID="clear-cart-btn">
                  <ButtonText fontFamily="$heading" fontWeight="$normal">
                    CLEAR
                  </ButtonText>
                </Button>
              </Box>
            ) : (
              <Text testID="no-items-text">No items added</Text>
            )}
          </Box>
        )}
      />
    </Box>
  );
};

export default CartScreen;
