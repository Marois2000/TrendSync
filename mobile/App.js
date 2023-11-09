import { StatusBar } from 'expo-status-bar';
import { StyleProvider } from 'react-native-zephyr';
import { StyledView, StyledText } from './StyleWrappers';
import Inputfield from './components/inputfield';
import Button from './components/button';
import LogIn from './pages/login';


export default function App() {
  return (
    <StyleProvider>
      <LogIn />
    </StyleProvider>
  );
}

