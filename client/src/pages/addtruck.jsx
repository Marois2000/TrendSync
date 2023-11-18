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
 * @description The add truck form to add a truck into the database
 * 
 * @returns html for the add truck form
 */
export const AddTruck = () => {
    const [name, setName] = useState(""); // The name of the truck
    const [model, setModel] = useState(""); // The model of the truck
    const [length, setLength] = useState(0) // The Length of the truck

    /**
     * @description Adds a truck into the database
     * 
     * @param {*} e The event used to prevent default refreshing 
     */
    const addTruckToDatabase = async e => {
        e.preventDefault();
        const body = {
            name: name,
            model: model,
            length: length
        }
        try {
           const req = await fetch(path+"/trendsync/addtruck", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
           });

           const res = await req.json();
           toast.success('Truck Added', {
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
            <div className="flex w-[70%] gap-20 mt-48 ">
                <InputField title="Truck Name" placeholder="Ex. NH x" value={name} onChange={(e) => setName(e.target.value)}/>
                <InputField title="Model" placeholder="Ex. Enterprise" value={model} onChange={(e) => setModel(e.target.value)}/>
            </div>
            <div className="flex w-[70%] gap-20">
                <div>
                    <InputField number={true} title="Length (ft.)" placeholder="Ex. Enterprise" value={length} onChange={(e) => setLength(e.target.value)}/>
                </div>
            </div>

            <div className="mt-10">
                <MyButton text="Add Truck" update={addTruckToDatabase}/>
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