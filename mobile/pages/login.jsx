/**
 * @author Tyler Marois
 */
import { StyledView, StyledText, StyledKAV } from '../StyleWrappers';
import Inputfield from '../components/inputfield';
import Button from '../components/button';
import { useState } from 'react';
import path from "../path";
import { KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';

/**
 * @description The login page
 * 
 * @param {*} setUser Sets the logged in user
 * 
 * @returns A login page to log users in
 */
export default LogIn = ({ setUser }) => {
    const [email, setEmail] = useState(""); // The users email address
    const [password, setPassword] = useState(""); // The users password

    /**
     * @description Calls the API and gets users info if credentials are correct
     */
    const login = async() => {
        const body = {
            email: email.toLowerCase(),
            password: password
        }

        try {
            const res = await fetch(path+'/trendsync/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if(data[0]) {
                storeUserInStorage(data[0]);
                setUser(data[0]);
            } else {
                Toast.show('Invalid Email or Password!', {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.TOP,
                    backgroundColor: '#FF3333',
                    opacity: 90,

                });
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * @description Store the users info to keep them logged in like cookies
     * 
     * @param {*} user The user to be kept logged in
     */
    const storeUserInStorage = async user => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 720); 
        const expiryTimeInTimestamp = Math.floor(now.getTime() / 1000); 
        const data = {
            expiryTime: expiryTimeInTimestamp,
            user: user
        };

        await AsyncStorage.setItem('user', JSON.stringify(data));
    }


    return (
        <KeyboardAvoidingView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#F5F5F5"}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
            
            <StyledText classes={["text:6xl", "color:primary", "mb:12"]}>Trendsync</StyledText>
            <StyledView classes={["w:full", "justify:center", "items:center"]}> 
            <Inputfield title="Email"
                value={email}
                placeholder="Enter your Email..."
                onChange={e => setEmail(e)}
            />   
            <Inputfield title="Password"
                value={password}
                placeholder="Enter your Password..."
                onChange={e => setPassword(e)}
                hidden={true}
            />          
            </StyledView>

            <Button text="Log In" update={login}/>

        </KeyboardAvoidingView>
    )
}