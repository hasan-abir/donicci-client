import type {StackScreenProps} from '@react-navigation/stack';
import {
  Box,
  Button,
  FormControl,
  HStack,
  Input,
  Pressable,
  ScrollView,
  Text,
  useTheme,
} from 'native-base';
import {useCallback, useContext, useState} from 'react';
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
  const [formDisabled, setFormDisabled] = useState<boolean>(false);

  const onSubmit = useCallback(async () => {
    setFormDisabled(true);

    const success = await authenticateUser(
      {
        email: formData.email || '',
        password: formData.password || '',
      },
      route.name,
    );

    setFormDisabled(false);

    if (success && navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [formData]);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}>
      <Box flex={1} py={2} px={6} justifyContent="center">
        <Text mb={6} fontFamily="body" fontSize="xl" textAlign="center">
          Login
        </Text>
        <Box mb={6}>
          <FormControl isRequired mb={2}>
            <FormControl.Label
              _text={{
                fontFamily: 'body',
              }}>
              Email
            </FormControl.Label>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={value => setData({...formData, email: value})}
              testID="email"
              fontFamily="body"
              borderWidth={0}
              backgroundColor={colors.white}
              borderRadius={10}
            />
          </FormControl>
          <FormControl isRequired mb={4}>
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
          </FormControl>
          <Button
            py={2}
            px={6}
            borderRadius={10}
            onPress={onSubmit}
            bgColor={colors.secondary[500]}
            _text={{fontFamily: 'body', fontWeight: 'bold'}}
            isDisabled={formDisabled}
            testID="submit-btn">
            LOGIN
          </Button>
        </Box>

        <HStack justifyContent="center">
          <Pressable
            onPress={() => navigation.navigate('Register')}
            testID="register-btn">
            <Text fontFamily="body" color={colors.primary[600]}>
              Register
            </Text>
          </Pressable>
          <Text fontFamily="body">, if you don't have an account</Text>
        </HStack>
      </Box>
    </ScrollView>
  );
};

export default LoginScreen;
