import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {Box, Divider, Text} from 'native-base';
import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';

interface Props {
  item: Category;
}

export interface Category {
  _id: string;
  name: string;
  updated_at: string;
  created_at: string;
}

const CategoryItem = ({item}: Props) => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList & RootTabParamList>>();

  return (
    <Box mb={3}>
      <Divider mb={3} />
      <Text
        onPress={() => {
          navigation.navigate('CategoryProducts', {categoryId: item._id});
        }}
        fontSize="md">
        {item.name}
      </Text>
    </Box>
  );
};

export default CategoryItem;
