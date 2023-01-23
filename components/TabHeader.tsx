import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../stacks/RootStack';
import type {RootTabParamList} from '../tabs/RootTab';

import {Box, theme} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchForm from './SearchForm';

const TabHeader = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList & RootTabParamList>>();

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      borderBottomColor={theme.colors.black}
      borderBottomWidth={2}
      padding={3}>
      <Box flex={1} marginRight={2}>
        <SearchForm />
      </Box>

      <Ionicons
        name={'person-circle'}
        size={32}
        color={theme.colors.black}
        onPress={() => navigation.navigate('Login')}
      />
    </Box>
  );
};

export default TabHeader;
