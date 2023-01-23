import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';
import {Box, Text, Heading, Pressable} from 'native-base';

type Props = BottomTabScreenProps<
  RootStackParamList & RootTabParamList,
  'Products'
>;

const HomeScreen = ({navigation}: Props) => {
  return (
    <Box height="full" justifyContent="center" alignItems="center">
      <Heading>Home</Heading>

      <Pressable
        onPress={() =>
          navigation.navigate('ProductDetails', {productId: '123'})
        }>
        <Text>Product screen</Text>
      </Pressable>
    </Box>
  );
};

export default HomeScreen;
