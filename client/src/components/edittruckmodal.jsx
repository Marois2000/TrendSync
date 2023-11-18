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

export const EditTruckModel = ({ truck, onClose }) => {
    const [name, setName] = useState(truck.name);
    const [model, setModel] = useState(truck.model);
    const [length, setLength] = useState(truck.length);
    const [active, setActive] = useState(truck.active);


    
    const updateTruck = async() => {
        const body = {
            name: name,
            model: model,
            length: length,
            active: active,
            id: truck.truck_id
        }
        
        try {
            const req = await fetch(path + "/trendsync/updatetruck", {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            const res = await req.json();
            toast.success('Truck Updated', {
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

    

    return (
        <div className="fixed h-[85%] w-[99%] z-50 bg-opacity-30 bg-black justify-center items-center flex">
            <div className="bg-background w-[70%] rounded-lg overflow-hidden">
                <div className="w-full bg-primary justify-between items-center flex mb-5">
                    <h1 className="text-white text-3xl p-2">Add Customer</h1>
                    <button className="text-white p-3 text-3xl" onClick={() => onClose(false)}><FontAwesomeIcon icon={faTimes} /></button>
                </div>

                <div className="flex w-full gap-20 px-5">
                    <InputField title="Truck Name" placeholder="Ex. NH x" value={name} onChange={(e) => setName(e.target.value)}/>
                    <InputField title="Model" placeholder="Ex. Enterprise" value={model} onChange={(e) => setModel(e.target.value)}/>
                </div>
                <div className="flex w-full gap-20 px-5">
                    <div>
                        <InputField number={true} title="Length (ft.)" placeholder="Ex. Enterprise" value={length} onChange={(e) => setLength(e.target.value)}/>
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
                    <MyButton text="Update" update={updateTruck}/>
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