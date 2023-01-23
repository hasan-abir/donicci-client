import type {StackScreenProps} from '@react-navigation/stack';
import type {RootStackParamList} from '../stacks/RootStack';
import {Box, Heading, Pressable, Text} from 'native-base';

type Props = StackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen = ({navigation}: Props) => {
  return (
    <Box height="full" justifyContent="center" alignItems="center">
      <Heading>Register</Heading>
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text>Sign in</Text>
      </Pressable>
    </Box>
  );
};

export default RegisterScreen;
