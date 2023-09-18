import type {StackScreenProps} from '@react-navigation/stack';
import {
  Box,
  Button,
  FormControl,
  Heading,
  HStack,
  Input,
  Pressable,
  ScrollView,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import {useContext, useState, useCallback} from 'react';
import {RootContext} from '../context/RootContext';
import type {RootStackParamList} from '../stacks/RootStack';

type Props = StackScreenProps<RootStackParamList, 'Register'>;

interface RegisterFormData {
  display_name?: string;
  username?: string;
  email?: string;
  password?: string;
}

const RegisterScreen = ({navigation, route}: Props) => {
  const {authenticateUser} = useContext(RootContext);
  const {colors} = useTheme();

  const [formData, setData] = useState<RegisterFormData>({});
  const [formDisabled, setFormDisabled] = useState<boolean>(false);

  const onSubmit = useCallback(async () => {
    setFormDisabled(true);

    const success = await authenticateUser(
      {
        display_name: formData.display_name || '',
        username: formData.username || '',
        email: formData.email || '',
        password: formData.password || '',
      },
      route.name,
    );

    setFormDisabled(false);

    if (success) {
      navigation.navigate('Home');
    }
  }, [formData]);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}>
      <Box flex={1} py={2} px={6} justifyContent="center">
        <Text mb={6} fontFamily="body" fontSize="xl" textAlign="center">
          Register
        </Text>
        <Box mb={6}>
          <FormControl isRequired mb={2}>
            <FormControl.Label
              _text={{
                fontFamily: 'body',
              }}>
              Display Name
            </FormControl.Label>
            <Input
              placeholder="John Hanson"
              onChangeText={value =>
                setData({...formData, display_name: value})
              }
              testID="display_name"
              fontFamily="body"
              borderWidth={0}
              backgroundColor={colors.white}
              borderRadius={10}
            />
          </FormControl>
          <FormControl isRequired mb={2}>
            <FormControl.Label
              _text={{
                fontFamily: 'body',
              }}>
              Username
            </FormControl.Label>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="john_1980"
              onChangeText={value => setData({...formData, username: value})}
              testID="username"
              fontFamily="body"
              borderWidth={0}
              backgroundColor={colors.white}
              borderRadius={10}
            />
          </FormControl>
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
              placeholder="example@test.com"
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
            isDisabled={formDisabled}>
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
    </ScrollView>
  );
};

export default RegisterScreen;
