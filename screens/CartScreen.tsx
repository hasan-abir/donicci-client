import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {RootTabParamList} from '../tabs/RootTab';
import {Box, Heading} from 'native-base';

type Props = BottomTabScreenProps<RootTabParamList, 'Cart'>;

const CartScreen = (props: Props) => {
  return (
    <Box height="full" justifyContent="center" alignItems="center">
      <Heading>Cart</Heading>
    </Box>
  );
};

export default CartScreen;
