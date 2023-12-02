import type {RouteProp} from '@react-navigation/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useState, useCallback, useMemo} from 'react';
import {
  Pressable,
  Input,
  Box,
  InputField,
  InputSlot,
} from '@gluestack-ui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';
import {config} from '../config/gluestack-ui.config';

const SearchForm = () => {
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
          variant="rounded"
          backgroundColor="$coolGray100"
          borderColor="$coolGray100"
          px="$2">
          <InputSlot>
            <Ionicons
              name={'search'}
              size={24}
              color={config.tokens.colors.coolGray400}
              style={{marginLeft: 10}}
            />
          </InputSlot>
          <InputField
            onSubmitEditing={() => navigation.setParams({term})}
            onChangeText={(text: string) => setTerm(text)}
            lineHeight={1.2}
            size="sm"
            py="$2"
            fontFamily="$body"
            fontWeight="$normal"
            placeholderTextColor="$coolGray400"
            placeholder="Search"
            autoFocus={inSearchScreen}
            testID="search"
          />
        </Input>
      </Box>
    </Pressable>
  );
};

export default SearchForm;
