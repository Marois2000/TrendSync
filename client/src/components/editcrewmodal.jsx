/**
 * @author Tyler Marois
 */
import React, { useState } from "react";
import { InputField } from "../components/inputfield";
import { MyButton } from "../components/mybutton";
import { path } from "../path";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

export const EditCrewModel = ({ crewMember, onClose }) => {
    const [first, setFirst] = useState(crewMember.first_name); // The users first name
    const [last, setLast] = useState(crewMember.last_name); // The users last name
    const [email, setEmail] = useState(crewMember.email); // The users email
    const [password, setPassword] = useState(crewMember.password); // The users password
    const [rank, setRank] = useState(crewMember.rank); // The users rank
    const [active, setActive] = useState(crewMember.active); // If the user is active or not

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const capitalLetterRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    
    const updateUser = async() => {
        const body = {
            first: first,
            last: last,
            email: email,
            password: password,
            rank: rank,
            active: active,
            id: crewMember.user_id
        }
        
        try {
            const req = await fetch(path + "/trendsync/updateuser", {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            const res = await req.json();
            toast.success('User Updated', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            location.reload();
        } catch (error) {
            console.log(error.message);
        }
    }

    const checkValidInputs = () => {
        if(password.length >= 12 && specialCharRegex.test(password) && capitalLetterRegex.test(password) && numberRegex.test(password)) {
            if(emailRegex.test(email)) {
                updateUser();
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
        <div className="fixed h-[85%] w-[99%] z-50 bg-opacity-30 bg-black justify-center items-center flex">
            <div className="bg-background w-[70%] rounded-lg overflow-hidden">
                <div className="w-full bg-primary justify-between items-center flex mb-5">
                    <h1 className="text-white text-3xl p-2">Add Customer</h1>
                    <button className="text-white p-3 text-3xl" onClick={() => onClose(false)}><FontAwesomeIcon icon={faTimes} /></button>
                </div>

                <div className="flex gap-10 justify-center items-center w-full px-5">
                    <InputField title="First Name" placeholder="Ex. John" value={first} onChange={(e) => setFirst(e.target.value)} />
                    <InputField title="Last Name" placeholder="Ex. Doe" value={last} onChange={(e) => setLast(e.target.value)}/>
                </div>

                <div className="flex gap-10 justify-center items-start w-full mt-5 px-5">
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

                <div className="flex gap-10 justify-start items-center w-full mt-5 px-5">
                    <div>
                        <InputField title="Rank" number={true} value={rank} placeholder="0-2" onChange={(e) => setRank(e.target.value % 3)}/>
                    </div>
                    <div className="justify-center flex items-center gap-5">
                        <div>
                            <input type="radio" defaultChecked={active} placeholder={true} onClick={() => setActive(true)} name="active" /> Active 
                        </div>
                        <div>
                            <input type="radio" defaultChecked={!active}  onClick={() => setActive(false)} name="active"  /> Inactive    
                        </div>
                    </div>
                </div>

                <div className="flex justify-start w-full my-5 px-5">
                    <MyButton text="Update" update={checkValidInputs}/>
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
    )
}