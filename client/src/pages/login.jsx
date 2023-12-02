/**
 * @author Tyler Marois
 */
import React, { useEffect, useState } from "react";
import { InputField } from "../components/inputfield";
import { MyButton } from "../components/mybutton";
import { path } from "../path";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CookiesProvider, useCookies } from "react-cookie";


/**
 * @description The login page of the admin website
 * 
 * @param loginSetter function that runs when user attempts a login
 * @param userSetter sets the user in the application for use elsewhere
 * @returns html to display the login page
 */
export const Login = ( {loginSetter, userSetter} ) => {
    const [email, setEmail] = useState(""); // The users email
    const [password, setPassword] = useState(""); // The users password
    const [cookies, setCookie] = useCookies(['user']); // The cookie used to keep the user logged in

    useEffect(() => {
        if(cookies.user) {
            if(cookies.user.rank == 2) {
                userSetter(cookies.user);
                loginSetter(true);
            }
        }
        
    }, [cookies]);

    /**
     * @description Checks if the user info is valid and updates state accordingly
     * 
     * @param {*} e The event triggered by button click
     */
    const checkValidLogin = async e => {
        console.log(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toUTCString());


        e.preventDefault();
        const body = {
            email: email,
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
                if(data[0].rank == 2) {
                    setCookie("user", data[0], { 
                        path: "/",
                        expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
                    });
                    userSetter(data[0]);
                    loginSetter(true);
                } else {
                    toast.error('Invalid Rank', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }
            } else {
                toast.error('Invalid Email or Password', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <CookiesProvider>
            <div className="flex justify-center items-center h-full">
                <div className="flex-col">
                    <h1 className="text-8xl text-center text-primary font-bold tracking-widest mb-20">Trendsync</h1>
                    <InputField title="Email" value={email} placeholder={"Email"} onChange={(e) => setEmail(e.target.value)}/>
                    <InputField title="Password" value={password} placeholder={"Password"} onChange={(e) => setPassword(e.target.value)} hidden={true}/>
                    <div className="mt-7">
                        <MyButton text="Sign In" update={checkValidLogin}/>
                    </div>
                    <ToastContainer
                        position="top-center"
                        autoClose={2000}
                        hideProgressBar={true}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </div>
            </div>
        </CookiesProvider>
    )
}