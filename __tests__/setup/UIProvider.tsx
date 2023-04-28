import {NativeBaseProvider} from 'native-base';

interface Props {
  children: JSX.Element;
}

const inset = {
  frame: {x: 0, y: 0, width: 0, height: 0},
  insets: {top: 0, left: 0, right: 0, bottom: 0},
};

const UIProvider = ({children}: Props) => {
  return (
    <NativeBaseProvider initialWindowMetrics={inset}>
      {children}
    </NativeBaseProvider>
  );
};

export default UIProvider;
