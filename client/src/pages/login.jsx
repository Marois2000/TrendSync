/**
 * @author Tyler Marois
 */
import React, { useState } from "react";
import { InputField } from "../components/inputfield";
import { MyButton } from "../components/mybutton";

/**
 * @description The login page of the admin website
 * 
 * @param loginSetter function that runs when user attempts a login
 * @returns html to display the login page
 */
export const Login = ( {loginSetter} ) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    /**
     * @description Checks if the user info is valid and updates state accordingly
     * 
     * @param {*} e The event triggered by button click
     */
    const checkValidLogin = async e => {
        e.preventDefault();
        const body = {
            email: email,
            password: password
        }
        console.log(body);
        try {
            const res = await fetch('http://localhost:5000/trendsync/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            console.log(data[0]);
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className="flex justify-center items-center h-full">
            <div className="flex-col">
                <h1 className="text-8xl text-center text-primary font-bold tracking-widest mb-20">Trendsync</h1>
                <InputField title="Email" value={email} placeholder={"Email"} onChange={(e) => setEmail(e.target.value)}/>
                <InputField title="Password" value={password} placeholder={"Password"} onChange={(e) => setPassword(e.target.value)} hidden={true}/>
                <MyButton text="Sign In" update={checkValidLogin}/>
            </div>
        </div>
    )
}