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

    /**
     * @description Calls the API and enters a user into the database
     * 
     * @param {*} e The event, to stop the refresh
     */
    const addUserToDatabase = async e => {
        e.preventDefault();

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
    
    return (
        <div className="flex flex-col w-full justify-center items-center">
            <div className="flex gap-10 justify-center items-center w-[80vw] mt-20">
                <InputField title="First Name" placeholder="Ex. John" value={first} onChange={(e) => setFirst(e.target.value)} />
                <InputField title="Last Name" placeholder="Ex. Doe" value={last} onChange={(e) => setLast(e.target.value)}/>
            </div>
            <div className="flex gap-10 justify-center items-center w-[80vw] mt-5">
                <InputField title="Email" placeholder="Ex. jdoe@example.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <InputField title="Password" hidden={true} placeholder="The users password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="flex gap-10 justify-start items-center w-[80vw] mt-5">
                <div>
                    <InputField title="Rank" number={true} value={rank} placeholder="0-2" onChange={(e) => setRank(e.target.value % 3)}/>
                </div>
            </div>
            <div className="flex justify-start w-[80vw] mt-5">
                <MyButton text="Add User" update={addUserToDatabase}/>
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