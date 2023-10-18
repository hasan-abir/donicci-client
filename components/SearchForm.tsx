import type {RouteProp} from '@react-navigation/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {Box, Input, Pressable, useTheme} from 'native-base';
import {useState, useCallback, useMemo} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';

const SearchForm = () => {
  const {colors} = useTheme();

  const [term, setTerm] = useState<string>('');

  const route = useRoute<RouteProp<RootStackParamList & RootTabParamList>>();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList & RootTabParamList>>();

  const inSearchScreen = useMemo(() => route.name === 'Search', [route]);

  const onPress = useCallback(() => {
    if (!inSearchScreen) {
      navigation.navigate('Search', {});
    }
  }, []);

  return (
    <Pressable onPress={onPress} testID="search-btn">
      <Box pointerEvents={inSearchScreen ? 'auto' : 'none'}>
        <Input
          onSubmitEditing={() => navigation.setParams({term})}
          onChangeText={text => setTerm(text)}
          variant="rounded"
          size="sm"
          px={2}
          height={10}
          placeholder="Search"
          backgroundColor={colors.gray[100]}
          borderWidth={0}
          InputLeftElement={
            <Ionicons
              name={'search'}
              size={24}
              color={colors.gray[400]}
              style={{marginLeft: 10}}
            />
          }
          w="100%"
          autoFocus={inSearchScreen}
          testID="search"
        />
      </Box>
    </Pressable>
  );
};

export default SearchForm;
