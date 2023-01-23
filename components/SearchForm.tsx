import type {RouteProp} from '@react-navigation/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {Box, Input, Pressable, theme} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';

const SearchForm = () => {
  const route = useRoute<RouteProp<RootStackParamList & RootTabParamList>>();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList & RootTabParamList>>();

  const inSearchScreen = route.name === 'Search';

  const onPress = () => {
    if (!inSearchScreen) {
      navigation.navigate('Search');
    }
  };

  return (
    <Pressable onPress={onPress}>
      <Box pointerEvents={inSearchScreen ? 'auto' : 'none'}>
        <Input
          variant="rounded"
          size="sm"
          height={8}
          placeholder="Search"
          borderColor={theme.colors.black}
          InputLeftElement={
            <Ionicons
              name={'search'}
              size={24}
              color={theme.colors.black}
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
