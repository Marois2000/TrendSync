import { StatusBar } from 'expo-status-bar';
import { StyleProvider } from 'react-native-zephyr';
import { StyledView, StyledText } from './StyleWrappers';
import Inputfield from './components/inputfield';
import Button from './components/button';
import LogIn from './pages/login';
import { useEffect, useState } from 'react';
import Home from "./pages/home";
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function App() {
  const [user, setUser] = useState({});

    useEffect(() => {
      getData();
    }, [])

    const getData = async () => {
      try {
        let jsonValue = await AsyncStorage.getItem('user');

        if(jsonValue != null) {
          jsonValue = JSON.parse(jsonValue);
        }

        const currentTimestamp = Math.floor(Date.now() / 1000);

        if (currentTimestamp >= jsonValue?.expiryTime) {
          AsyncStorage.removeItem(storageKeyName);
          return; 
        } else {
          if(jsonValue.user) {
            setUser(jsonValue.user);
          }
        }


      } catch (error) {
        console.log(error.message)
      }
    };

  return (
    <StyleProvider>
      {user.user_id ? 
        <Home user={user} setUser={setUser}/>
      : <LogIn setUser={setUser}/>}

    </StyleProvider>
  );
}

