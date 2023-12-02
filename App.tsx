import {GluestackUIProvider} from '@gluestack-ui/themed';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';
import 'react-native-gesture-handler';
import {config} from './config/gluestack-ui.config';
import RootContextProvider from './context/RootContext';
import RootStack from './stacks/RootStack';

const App = () => {
  return (
    <GluestackUIProvider config={config}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <RootContextProvider>
          <RootStack />
        </RootContextProvider>
      </TouchableWithoutFeedback>
    </GluestackUIProvider>
  );
};

export default App;
