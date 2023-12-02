import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import ProductList from '../components/ProductList';
import type {RootTabParamList} from '../tabs/RootTab';
import {Box} from '@gluestack-ui/themed';

interface Props extends BottomTabScreenProps<RootTabParamList, 'Products'> {}

const HomeScreen = () => {
  return (
    <Box flex={1}>
      <ProductList />
    </Box>
  );
};

export default HomeScreen;
