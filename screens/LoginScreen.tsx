import type {StackScreenProps} from '@react-navigation/stack';
import type {RootStackParamList} from '../stacks/RootStack';
import {Box, Heading, Pressable, Text} from 'native-base';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({navigation}: Props) => {
  return (
    <Box height="full" justifyContent="center" alignItems="center">
      <Heading>Login</Heading>
      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text>Sign up</Text>
      </Pressable>
    </Box>
  );
};

export default LoginScreen;
