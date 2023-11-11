/**
 * @author Tyler Marois
 */
import { StyledView, StyledText } from '../StyleWrappers';
import Inputfield from '../components/inputfield';
import Button from '../components/button';
import { useState } from 'react';
import path from "../path";

export default LogIn = ({ setUser }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


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

            setUser(data[0]);
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <StyledView classes={["flex:1", "justify:center", "items:center", "bg:background"]} >
            
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

        </StyledView>
    )
}