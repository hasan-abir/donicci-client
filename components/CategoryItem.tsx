import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {Box, Button, Divider, Text, useTheme} from 'native-base';
import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';
import {useMemo} from 'react';

interface Props {
  item: Category;
  index: number;
}

export interface Category {
  _id: string;
  name: string;
  updated_at: string;
  created_at: string;
}

const CategoryItem = ({item, index}: Props) => {
  const {colors} = useTheme();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList & RootTabParamList>>();
  const isOdd = useMemo((): boolean => index % 2 == 1, []);

  return (
    <Button
      borderRadius={100}
      mb={5}
      onPress={() => {
        navigation.navigate('CategoryProducts', {categoryId: item._id});
      }}
      bgColor={isOdd ? colors.secondary[100] : colors.primary[100]}
      _text={{
        fontFamily: 'body',
        fontWeight: 'bold',
        color: isOdd ? colors.secondary[500] : colors.primary[500],
      }}
      testID={'category-title-' + item._id}>
      {item.name}
    </Button>
  );
};

export default CategoryItem;
