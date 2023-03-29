import type {RouteProp} from '@react-navigation/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {Box, Input, Pressable, useTheme} from 'native-base';
import {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';

const SearchForm = () => {
  const {colors} = useTheme();

  const [term, setTerm] = useState<string>('');

  const route = useRoute<RouteProp<RootStackParamList & RootTabParamList>>();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList & RootTabParamList>>();

  const inSearchScreen = route.name === 'Search';

  const onPress = () => {
    if (!inSearchScreen) {
      navigation.navigate('Search', {});
    }
  };

  return (
    <Pressable onPress={onPress}>
      <Box pointerEvents={inSearchScreen ? 'auto' : 'none'}>
        <Input
          onSubmitEditing={() => navigation.setParams({term})}
          onChangeText={text => setTerm(text)}
          variant="rounded"
          size="sm"
          height={8}
          placeholder="Search"
          borderColor={colors.black}
          InputLeftElement={
            <Ionicons
              name={'search'}
              size={24}
              color={colors.black}
              style={{marginLeft: 10}}
            />
          }
          w="100%"
          autoFocus={inSearchScreen}
        />
      </Box>
    </Pressable>
  );
};

export default SearchForm;
