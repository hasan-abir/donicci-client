import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {Button, ButtonText} from '@gluestack-ui/themed';
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
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList & RootTabParamList>>();
  const isOdd = useMemo((): boolean => index % 2 == 1, []);

  return (
    <Button
      borderRadius="$lg"
      mb="$5"
      onPress={() => {
        navigation.navigate('CategoryProducts', {categoryId: item._id});
      }}
      bgColor={isOdd ? '$secondary700' : '$primary700'}
      testID={'category-title-' + item._id}>
      <ButtonText fontFamily="$heading" fontWeight="$normal" color="$white">
        {item.name}
      </ButtonText>
    </Button>
  );
};

export default CategoryItem;
