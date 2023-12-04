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
      <Box flex={1} py="$2" px="$16" justifyContent="center">
        <Text mb="$6" fontSize="$xl" textAlign="center">
          Login
        </Text>
        <Box mb="$6">
          <FormControl isRequired mb="$2">
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={value => setData({...formData, email: value})}
                testID="email"
                fontFamily="$body"
                borderWidth={0}
                backgroundColor="$white"
                borderRadius="$lg"
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
                borderRadius="$lg"
                py="$2"
              />
            </Input>
          </FormControl>
          <Button
            py="$2"
            px="$6"
            borderRadius="$lg"
            onPress={onSubmit}
            bgColor="$secondary700"
            isDisabled={formDisabled}
            testID="submit-btn">
            <ButtonText fontFamily="$heading" fontWeight="$bold">
              LOGIN
            </ButtonText>
          </Button>
        </Box>

        <HStack justifyContent="center">
          <Pressable
            onPress={() => navigation.navigate('Register')}
            testID="register-btn">
            <Text color="$primary700">Register</Text>
          </Pressable>
          <Text>, if you don't have an account</Text>
        </HStack>
      </Box>
    </ScrollView>
  );
};

export default LoginScreen;
