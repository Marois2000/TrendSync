/**
 * @author Tyler Marois
 */
import React, { useState } from "react";
import { InputField } from "../components/inputfield";
import { MyButton } from "../components/mybutton";
import { path } from "../path";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * @description The add user page
 * 
 * @returns An html form for adding users/crew into the database
 */
export const AddUser = () => {
    const [first, setFirst] = useState(""); // The users first name
    const [last, setLast] = useState(""); // The users last name
    const [email, setEmail] = useState(""); // The users email
    const [password, setPassword] = useState(""); // The users password
    const [rank, setRank] = useState(0); // The users rank

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const capitalLetterRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;


    /**
     * @description Calls the API and enters a user into the database
     */
    const addUserToDatabase = async() => {
        const body = {
            first: first,
            last: last,
            email: email,
            password: password,
            rank: rank
        }
        
        try {
            const req = await fetch(path + "/trendsync/adduser", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            const res = await req.json();
            toast.success('User Added', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

        } catch (error) {
            console.log(error.message);
        }
    }

    const checkValidInputs = () => {
        if(password.length >= 12 && specialCharRegex.test(password) && capitalLetterRegex.test(password) && numberRegex.test(password)) {
            if(emailRegex.test(email)) {
                addUserToDatabase();
            } else {
                toast.error('Invalid Email', {
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
            toast.error('Invalid Password', {
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
    }
    
    return (
        <div className="flex flex-col w-full justify-center items-center">
            <div className="flex gap-10 justify-center items-center w-[80vw] mt-20">
                <InputField title="First Name" placeholder="Ex. John" value={first} onChange={(e) => setFirst(e.target.value)} />
                <InputField title="Last Name" placeholder="Ex. Doe" value={last} onChange={(e) => setLast(e.target.value)}/>
            </div>
            <div className="flex gap-10 justify-center items-start w-[80vw] mt-5">
                <div className="w-full justify-start items-center ">
                    <InputField title="Email" placeholder="Ex. jdoe@example.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="w-full justify-start items-center">
                    <InputField title="Password" placeholder="The users password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <h1>Passwords must:</h1>
                    <h1 className="text-sm" style={{ color: specialCharRegex.test(password) ? 'green' : 'black' }}>Contain at least 1 special character</h1>
                    <h1 className="text-sm" style={{ color: capitalLetterRegex.test(password) ? 'green' : 'black' }}>Contain at least 1 capital letter</h1>
                    <h1 className="text-sm" style={{ color: numberRegex.test(password) ? 'green' : 'black' }}>Contain at least 1 number</h1>
                    <h1  className="text-sm" style={{ color: password.length >= 12 ? 'green' : 'black' }}>Be at least 12 characters long</h1>
                </div>
            </div>
            <div className="flex gap-10 justify-start items-center w-[80vw] mt-5">
                <div>
                    <InputField title="Rank" number={true} value={rank} placeholder="0-2" onChange={(e) => setRank(e.target.value % 3)}/>
                </div>
            </div>
            <div className="flex justify-start w-[80vw] mt-5">
                <MyButton text="Add User" update={checkValidInputs}/>
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
    )
}