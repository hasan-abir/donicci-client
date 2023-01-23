import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {RootTabParamList} from '../tabs/RootTab';
import type {RootStackParamList} from '../stacks/RootStack';
import {Box, Heading, Pressable} from 'native-base';

type Props = BottomTabScreenProps<
  RootTabParamList & RootStackParamList,
  'Categories'
>;

const CategoryListScreen = ({navigation}: Props) => {
  return (
    <Box height="full" justifyContent="center" alignItems="center">
      <Pressable
        onPress={() => {
          navigation.navigate('CategoryProducts', {categoryId: '123'});
        }}>
        <Heading>Category</Heading>
      </Pressable>
    </Box>
  );
};

export default CategoryListScreen;
