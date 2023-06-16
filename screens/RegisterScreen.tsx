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
import {useContext, useState, useCallback} from 'react';
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

  const validate = useCallback(() => {
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
  }, [formData]);

  const onSubmit = useCallback(async () => {
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
  }, [formData]);

  return (
    <Box flex={1} px={6} justifyContent="center">
      <Text mb={6} fontFamily="body" fontSize="xl" textAlign="center">
        Register
      </Text>
      <Box mb={6}>
        <FormControl isRequired isInvalid={'username' in errors} mb={2}>
          <FormControl.Label
            _text={{
              fontFamily: 'body',
            }}>
            Username
          </FormControl.Label>
          <Input
            placeholder="John"
            onChangeText={value => setData({...formData, username: value})}
            testID="username"
            fontFamily="body"
            borderWidth={0}
            backgroundColor={colors.white}
            borderRadius={10}
          />
          {'username' in errors ? (
            <FormControl.ErrorMessage colorScheme={colors.danger[600]}>
              {errors.username}
            </FormControl.ErrorMessage>
          ) : null}
        </FormControl>
        <FormControl isRequired isInvalid={'email' in errors} mb={2}>
          <FormControl.Label
            _text={{
              fontFamily: 'body',
            }}>
            Email
          </FormControl.Label>
          <Input
            placeholder="example@test.com"
            onChangeText={value => setData({...formData, email: value})}
            testID="email"
            fontFamily="body"
            borderWidth={0}
            backgroundColor={colors.white}
            borderRadius={10}
          />
          {'email' in errors ? (
            <FormControl.ErrorMessage colorScheme={colors.danger[600]}>
              {errors.email}
            </FormControl.ErrorMessage>
          ) : null}
        </FormControl>
        <FormControl isRequired isInvalid={'password' in errors} mb={4}>
          <FormControl.Label
            _text={{
              fontFamily: 'body',
            }}>
            Password
          </FormControl.Label>
          <Input
            type="password"
            onChangeText={value => setData({...formData, password: value})}
            testID="password"
            fontFamily="body"
            borderWidth={0}
            backgroundColor={colors.white}
            borderRadius={10}
          />
          {'password' in errors ? (
            <FormControl.ErrorMessage colorScheme={colors.danger[600]}>
              {errors.password}
            </FormControl.ErrorMessage>
          ) : null}
        </FormControl>
        <Button
          py={2}
          px={6}
          borderRadius={10}
          onPress={onSubmit}
          bgColor={colors.secondary[500]}
          _text={{fontFamily: 'body', fontWeight: 'bold'}}>
          REGISTER
        </Button>
      </Box>

      <HStack justifyContent="center">
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text fontFamily="body" color={colors.primary[600]}>
            Login
          </Text>
        </Pressable>
        <Text fontFamily="body">, if you already have an account</Text>
      </HStack>
    </Box>
  );
};

export default RegisterScreen;
