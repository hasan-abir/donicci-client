import type {StackScreenProps} from '@react-navigation/stack';
import type {RootStackParamList} from '../stacks/RootStack';
import {Box, Heading} from 'native-base';

type Props = StackScreenProps<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen = ({route}: Props) => {
  return (
    <Box height="full" justifyContent="center" alignItems="center">
      <Heading>Product id: {route.params.productId}</Heading>
    </Box>
  );
};

export default ProductDetailsScreen;
