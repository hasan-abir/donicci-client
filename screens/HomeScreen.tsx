import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Box} from 'native-base';
import ProductList from '../components/ProductList';
import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';

type Props = BottomTabScreenProps<
  RootStackParamList & RootTabParamList,
  'Products'
>;

const HomeScreen = () => {
  return (
    <Box flex={1} px={3}>
      <ProductList />
    </Box>
  );
};

export default HomeScreen;
