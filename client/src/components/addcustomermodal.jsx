/**
 * @author Tyler Marois
 */
import React, { useState } from "react";
import { InputField } from "./inputfield";
import { MyButton } from "./mybutton";
import { path } from "../path";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

/**
 * @description A popup window to add a customer to the database
 * 
 * @param {*} isOpen Boolean if the modal should be open
 * @param {*} onClose The function to close the modal
 * @param {*} setCustomer Sets the customers state
 * @param {*} updateCustomers Updates the list of customers
 * 
 * @returns HTML for a popup modal
 */
export const AddCustomerModal = ({ isOpen, onClose, setCustomer, updateCustomers }) => {
    const [first, setFirst] = useState(""); // The customers First name
    const [last, setLast] = useState(""); // The customers Last name
    const [email, setEmail] = useState(""); // The customers Email
    const [phone, setPhone] = useState(""); // The customers Phone number

    const modalcss = isOpen
    ? 'fixed inset-0 flex items-center justify-center z-40 overflow-x-hidden overflow-y-auto bg-black bg-opacity-50'
    : 'hidden';

    /**
     * @description Adds a customer to the database
     * 
     * @param e The event used to prevent default refresh
     */
    const addCustomerToDatabase = async e => {
        e.preventDefault();
        const body = {
            first: first,
            last: last,
            email: email,
            phone: phone
        }
        try {
            const req = await fetch(path+"/trendsync/addcustomer", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            const res = await req.json();
            console.log(res);
            if(req.ok) {
                toast.success('Customer Added!', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                onClose(false);
                setCustomer(res[0]);
                updateCustomers();
            } else {
                toast.error('Error adding customer', {
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
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={modalcss}>
            <div className="flex flex-col justify-center items-center w-[100vh] h-[80vh] z-50">
                <div className="bg-primary w-full rounded-t-3xl flex justify-between">
                    <h1 className="text-white text-3xl p-2">Add Customer</h1>
                    <button className="text-white p-3 text-3xl" onClick={() => onClose(false)}><FontAwesomeIcon icon={faTimes} /></button>
                </div>
                <div className="flex flex-col justify-center items-center bg-background w-full">
                    <div className="flex justify-center items-stretch m-5 gap-10 w-[80%]">
                        <InputField title="First Name" placeholder="Ex. John" value={first} onChange={(e) => setFirst(e.target.value)}/>
                        <InputField title="Last Name" placeholder="Ex. Doe" value={last} onChange={(e) => setLast(e.target.value)}/>
                    </div>
                    <div className="flex justify-center items-stretch m-5 gap-10 w-[80%]">
                        <InputField title="Email" placeholder="Ex. jdoe@example.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <InputField title="Phone" placeholder="Ex. (XXX) XXX-XXXX" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                    </div>
                </div>
                <div className="bg-grey-200 w-full rounded-b-3xl p-3 flex justify-end">
                    <MyButton text="Add" update={addCustomerToDatabase}/>
                </div>
            </div>
        </div>
    )
}