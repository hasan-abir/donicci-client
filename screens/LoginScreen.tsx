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

type Props = StackScreenProps<RootStackParamList, 'Login'>;

interface LoginFormData {
  email?: string;
  password?: string;
}

const LoginScreen = ({navigation, route}: Props) => {
  const {authenticateUser} = useContext(RootContext);
  const {colors} = useTheme();

  const [formData, setData] = useState<LoginFormData>({});
  const [errors, setErrors] = useState<LoginFormData>({});

  const validate = useCallback(() => {
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
  }, [formData]);

  const onSubmit = useCallback(async () => {
    if (validate()) {
      const success = await authenticateUser(
        {
          email: formData.email || '',
          password: formData.password || '',
        },
        route.name,
      );

      if (success && navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, [formData]);

  return (
    <Box flex={1} px={6} justifyContent="center">
      <Text mb={6} fontFamily="body" fontSize="xl" textAlign="center">
        Login
      </Text>
      <Box mb={6}>
        <FormControl isRequired isInvalid={'email' in errors} mb={2}>
          <FormControl.Label
            _text={{
              fontFamily: 'body',
            }}>
            Email
          </FormControl.Label>
          <Input
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
          LOGIN
        </Button>
      </Box>

      <HStack justifyContent="center">
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text fontFamily="body" color={colors.primary[600]}>
            Register
          </Text>
        </Pressable>
        <Text fontFamily="body">, if you don't have an account</Text>
      </HStack>
    </Box>
  );
};

export default LoginScreen;
