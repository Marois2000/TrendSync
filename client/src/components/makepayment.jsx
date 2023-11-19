/**
 * @author Tyler Marois
 */
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { MyButton } from "./mybutton";
import { path } from "../path";


export const MakePayment = ({ customer, onClose, toast }) => {
    const [payment, setPayment] = useState(customer.balance);
    const [remaining, setRemaining] = useState(customer.balance - payment);

    const makePayment = async() => {
        const body = {
            balance: remaining,
            id: customer.customer_id
        }
        console.log(body)
    
        try {
            const req = await fetch(path + "/trendsync/setbalance", {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            toast.success('Payment Made!', {
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

    const updateBalance = (value) => {
        setPayment(value);
        setRemaining(customer.balance - value);
    }

    return (
        <div className="w-full h-full bg-opacity-30 bg-black absolute flex justify-center items-center top-0">
            <div className="rounded-lg overflow-hidden flex justify-center items-center w-[40vh] flex-col">
                <div className="bg-primary justify-between items-center flex px-3 py-2 w-full">
                    <h1 className="text-white text-2xl">Make Payment</h1>
                    <button className="text-white text-3xl" onClick={() => onClose(false)}><FontAwesomeIcon icon={faTimes} /></button>
                </div>

                <div className="w-full justify-between items-center flex bg-background px-5 pb-2">
                    <h1 className="text-lg">Balance</h1>
                    <h1>{new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }).format(customer.balance)}
                    </h1>
                </div>

                <div className="w-full justify-between items-center flex bg-background px-5 pb-2 border-b-2 border-black">
                    <h1 className="text-lg">Payment</h1>
                    <input type="number" onChange={(e) => updateBalance(e.target.value)} value={payment} 
                    className="text-right drop-shadow appearance-none block bg-gray-200 text-gray-700 border border-primary rounded py-1  leading-tight focus:outline-none focus:bg-white" />
                </div>

                <div className="w-full justify-between items-center flex bg-grey-100 px-5">
                    <h1 className="text-lg">Balance</h1>
                    <h1>{new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }).format(remaining)}
                    </h1>
                </div>

                <div className="w-full justify-end items-center flex bg-grey-100 px-5 py-3">
                    <MyButton text="Submit" update={makePayment}/>
                </div>
            </div>

            
        </div>
    )
}