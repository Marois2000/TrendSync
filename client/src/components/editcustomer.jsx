/**
 * @author Tyler Marois
 */
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { MyButton } from "./mybutton";
import { InputField } from "./inputfield";
import { path } from "../path";
import { ToastContainer, toast } from 'react-toastify';

/**
 * @description A pop up for editing customers
 * 
 * @param {*} customer The customer being edited
 * @param {*} onClose Closes the modal
 * @param {*} toast Display some toast when needed
 * 
 * @returns A pop up menu
 */
export const EditCustomer = ({ customer, onClose, toast }) => {
    const [first, setFirst] = useState(customer.first_name); // The customers first name
    const [last, setLast] = useState(customer.last_name); // The customers last name
    const [email, setEmail] = useState(customer.email); // The customers email
    const [phone, setPhone] = useState(customer.phone); // The customers phone number

    /**
     * Calls the API and updates the customer
     */
    const updateCustomer = async() => {
        const body = {
            first: first,
            last: last,
            email: email,
            phone: phone,
            id: customer.customer_id
        }
        try {
            const req = await fetch(path + "/trendsync/updatecustomer", {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            toast.success('Customer Updated!', {
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
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className="w-full h-full bg-opacity-30 bg-black absolute flex justify-center items-center top-0">
            <div className="rounded-lg overflow-hidden flex justify-center items-center w-[70vh] flex-col">
                <div className="bg-primary justify-between items-center flex px-3 py-2 w-full">
                    <h1 className="text-white text-2xl">Edit Customer</h1>
                    <button className="text-white text-3xl" onClick={() => onClose(false)}><FontAwesomeIcon icon={faTimes} /></button>
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

                <div className="w-full justify-end items-center flex bg-grey-100 px-5 py-3">
                    <MyButton text="Submit" update={updateCustomer}/>
                </div>
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