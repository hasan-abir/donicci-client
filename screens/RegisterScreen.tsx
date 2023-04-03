import type {StackScreenProps} from '@react-navigation/stack';
import {
  Box,
  Button,
  FormControl,
  Heading,
  HStack,
  Input,
  Pressable,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import {useContext, useState} from 'react';
import {RootContext} from '../context/RootContext';
import type {RootStackParamList} from '../stacks/RootStack';

type Props = StackScreenProps<RootStackParamList, 'Register'>;

interface RegisterFormData {
  username?: string;
  email?: string;
  password?: string;
}

const RegisterScreen = ({navigation, route}: Props) => {
  const {authenticateUser} = useContext(RootContext);
  const {colors} = useTheme();

  const [formData, setData] = useState<RegisterFormData>({});
  const [errors, setErrors] = useState<RegisterFormData>({});

  const validate = () => {
    setErrors({});

    if (formData.username === undefined || formData.username === '') {
      setErrors(prevState => ({
        ...prevState,
        username: 'Username is required',
      }));
      return false;
    }

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
      const success = await authenticateUser(
        {
          username: formData.username || '',
          email: formData.email || '',
          password: formData.password || '',
        },
        route.name,
      );

      if (success) {
        navigation.navigate('Home');
      }
    }
  };

  return (
    <Box flex={1} justifyContent="center" alignItems="center" px={3}>
      <Heading mb={8}>Register</Heading>
      <VStack mb={3} width="full" maxW={300}>
        <FormControl isRequired isInvalid={'username' in errors}>
          <FormControl.Label
            _text={{
              bold: true,
            }}>
            Username
          </FormControl.Label>
          <Input
            placeholder="John"
            onChangeText={value => setData({...formData, username: value})}
          />
          {'username' in errors ? (
            <FormControl.ErrorMessage>
              {errors.username}
            </FormControl.ErrorMessage>
          ) : null}
        </FormControl>
        <FormControl isRequired isInvalid={'email' in errors}>
          <FormControl.Label
            _text={{
              bold: true,
            }}>
            Email
          </FormControl.Label>
          <Input
            placeholder="example@test.com"
            onChangeText={value => setData({...formData, email: value})}
          />
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
          <Text fontWeight="bold" fontSize="md">
            Register
          </Text>
        </Button>
      </VStack>

      <HStack>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text underline bold color={colors.primary[700]}>
            Login
          </Text>
        </Pressable>
        <Text>, if you already have an account</Text>
      </HStack>
    </Box>
  );
};

export default RegisterScreen;
