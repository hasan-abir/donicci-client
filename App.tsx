import {NativeBaseProvider, extendTheme, theme} from 'native-base';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';
import 'react-native-gesture-handler';
import RootContextProvider from './context/RootContext';
import RootStack from './stacks/RootStack';

// Overwrite primary theme
const uiTheme = extendTheme({
  fontConfig: {
    NotoSans: {
      400: {normal: 'NotoSans-Regular'},
      600: {normal: 'NotoSans-SemiBold'},
      700: {normal: 'NotoSans-Bold'},
    },
  },
  fonts: {heading: 'NotoSans', body: 'NotoSans'},
  colors: {
    primary: {
      50: theme.colors.teal[50],
      100: theme.colors.teal[100],
      200: theme.colors.teal[200],
      300: theme.colors.teal[300],
      400: theme.colors.teal[400],
      500: theme.colors.teal[500],
      600: theme.colors.teal[600],
      700: theme.colors.teal[700],
      800: theme.colors.teal[800],
      900: theme.colors.teal[900],
    },
    secondary: {
      50: theme.colors.violet[50],
      100: theme.colors.violet[100],
      200: theme.colors.violet[200],
      300: theme.colors.violet[300],
      400: theme.colors.violet[400],
      500: theme.colors.violet[500],
      600: theme.colors.violet[600],
      700: theme.colors.violet[700],
      800: theme.colors.violet[800],
      900: theme.colors.violet[900],
    },
  },
});

const App = () => {
  return (
    <NativeBaseProvider theme={uiTheme}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <RootContextProvider>
          <RootStack />
        </RootContextProvider>
      </TouchableWithoutFeedback>
    </NativeBaseProvider>
  );
};

export default App;
