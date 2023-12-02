import type {StackScreenProps} from '@react-navigation/stack';
import {
  ScrollView,
  Box,
  Text,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Button,
  ButtonText,
  HStack,
  Pressable,
} from '@gluestack-ui/themed';
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
      testID="register-screen"
      contentContainerStyle={{
        flexGrow: 1,
      }}>
      <Box flex={1} py="$2" px="$16" justifyContent="center">
        <Text mb="$6" fontSize="$xl" textAlign="center">
          Register
        </Text>
        <Box mb="$6">
          <FormControl isRequired mb="$2">
            <FormControlLabel>
              <FormControlLabelText>Display Name</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="John Hanson"
                onChangeText={value =>
                  setData({...formData, display_name: value})
                }
                testID="display_name"
                fontFamily="$body"
                borderWidth="$0"
                backgroundColor="$white"
                borderRadius={10}
                py="$2"
              />
            </Input>
          </FormControl>
          <FormControl isRequired mb="$2">
            <FormControlLabel>
              <FormControlLabelText>Username</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="john_1980"
                onChangeText={value => setData({...formData, username: value})}
                testID="username"
                fontFamily="$body"
                borderWidth="$0"
                backgroundColor="$white"
                borderRadius={10}
                py="$2"
              />
            </Input>
          </FormControl>
          <FormControl isRequired mb="$2">
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="example@test.com"
                onChangeText={value => setData({...formData, email: value})}
                testID="email"
                fontFamily="$body"
                borderWidth="$0"
                backgroundColor="$white"
                borderRadius={10}
                py="$2"
              />
            </Input>
          </FormControl>
          <FormControl isRequired mb="$4">
            <FormControlLabel>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="password"
                onChangeText={value => setData({...formData, password: value})}
                testID="password"
                fontFamily="$body"
                borderWidth="$0"
                backgroundColor="$white"
                borderRadius={10}
                py="$2"
              />
            </Input>
          </FormControl>
          <Button
            py="$2"
            px="$6"
            borderRadius={10}
            onPress={onSubmit}
            bgColor="$secondary700"
            isDisabled={formDisabled}
            testID="submit-btn">
            <ButtonText fontFamily="$heading" fontWeight="$bold">
              REGISTER
            </ButtonText>
          </Button>
        </Box>

        <HStack justifyContent="center">
          <Pressable
            onPress={() => navigation.navigate('Login')}
            testID="login-btn">
            <Text color="$primary700">Login</Text>
          </Pressable>
          <Text>, if you already have an account</Text>
        </HStack>
      </Box>
    </ScrollView>
  );
};

export default RegisterScreen;
