import { StatusBar } from 'expo-status-bar';
import { StyleProvider } from 'react-native-zephyr';
import { StyledView, StyledText } from './StyleWrappers';
import Inputfield from './components/inputfield';
import Button from './components/button';
import LogIn from './pages/login';
import { useState } from 'react';
import Home from "./pages/home";


export default function App() {
  const [user, setUser] = useState();

  return (
    <StyleProvider>


      {user ? 
        <Home user={user}/>
      : <LogIn setUser={setUser}/>}

    </StyleProvider>
  );
}

