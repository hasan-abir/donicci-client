import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Box} from 'native-base';
import ProductList from '../components/ProductList';
import type {RootTabParamList} from '../tabs/RootTab';

interface Props extends BottomTabScreenProps<RootTabParamList, 'Products'> {}

const HomeScreen = () => {
  return (
    <Box flex={1}>
      <ProductList />
    </Box>
  );
};

export default HomeScreen;
