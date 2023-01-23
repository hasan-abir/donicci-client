import 'react-native-gesture-handler';
import {extendTheme, theme} from 'native-base';
import RootStack from './stacks/RootStack';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';

const navTheme = {
  ...DefaultTheme,
  colors: {...DefaultTheme.colors, background: theme.colors.white},
};

const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer theme={navTheme}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <RootStack />
        </TouchableWithoutFeedback>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
