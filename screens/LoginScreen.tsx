import {useState} from 'react';
import type {StackScreenProps} from '@react-navigation/stack';
import type {RootStackParamList} from '../stacks/RootStack';
import {
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import userController from '../controllers/userController';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

interface LoginFormData {
  email?: string;
  password?: string;
}

const LoginScreen = ({navigation}: Props) => {
  const [formData, setData] = useState<LoginFormData>({});
  const [errors, setErrors] = useState<LoginFormData>({});

  const validate = () => {
    setErrors({});

    if (formData.email === undefined || formData.email === '') {
      setErrors(prevState => ({...prevState, email: 'Email is required'}));
      return false;
    } else if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        formData.email,
      )
    ) {
      setErrors(prevState => ({...prevState, email: 'Email is not valid'}));
      return false;
    }

    if (formData.password === undefined || formData.password === '') {
      setErrors(prevState => ({
        ...prevState,
        password: 'Password is required',
      }));
      return false;
    } else if (formData.password.length < 8) {
      setErrors(prevState => ({
        ...prevState,
        password: 'Password is too short',
      }));
      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    if (validate()) {
      const success = await userController.login({
        email: formData.email || '',
        password: formData.password || '',
      });

      if (success) {
        navigation.navigate('Home');
      }
    }
  };

  return (
    <Box flex={1} justifyContent="center" alignItems="center" px={3}>
      <Heading mb={8}>Login</Heading>
      <VStack mb={3} width="full" maxW={300}>
        <FormControl isRequired isInvalid={'email' in errors}>
          <FormControl.Label
            _text={{
              bold: true,
            }}>
            Email
          </FormControl.Label>
          <Input onChangeText={value => setData({...formData, email: value})} />
          {'email' in errors ? (
            <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>
          ) : null}
        </FormControl>
        <FormControl isRequired isInvalid={'password' in errors}>
          <FormControl.Label
            _text={{
              bold: true,
            }}>
            Password
          </FormControl.Label>
          <Input
            type="password"
            onChangeText={value => setData({...formData, password: value})}
          />
          {'password' in errors ? (
            <FormControl.ErrorMessage>
              {errors.password}
            </FormControl.ErrorMessage>
          ) : null}
        </FormControl>
        <Button onPress={onSubmit} mt="5">
          <Text>Login</Text>
        </Button>
      </VStack>

      <Text>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text underline bold>
            Register
          </Text>
        </Pressable>
        , if you don't have an account
      </Text>
    </Box>
  );
};

export default LoginScreen;
