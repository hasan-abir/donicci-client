import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {extendTheme, NativeBaseProvider, theme} from 'native-base';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';
import 'react-native-gesture-handler';
import RootStack from './stacks/RootStack';
import RootContextProvider from './context/RootContext';

// Overwrite primary theme
const uiTheme = extendTheme({
  colors: {
    primary: {
      50: theme.colors.yellow[50],
      100: theme.colors.yellow[100],
      200: theme.colors.yellow[200],
      300: theme.colors.yellow[300],
      400: theme.colors.yellow[400],
      500: theme.colors.yellow[400],
      600: theme.colors.yellow[400],
      700: theme.colors.yellow[500],
      800: theme.colors.yellow[500],
      900: theme.colors.yellow[900],
    },
  },
});

const navTheme = {
  ...DefaultTheme,
  // Change app background
  colors: {...DefaultTheme.colors, background: theme.colors.white},
};

const App = () => {
  return (
    <NativeBaseProvider theme={uiTheme}>
      <NavigationContainer theme={navTheme}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <RootContextProvider>
            <RootStack />
          </RootContextProvider>
        </TouchableWithoutFeedback>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
