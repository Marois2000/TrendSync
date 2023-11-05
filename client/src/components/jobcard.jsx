/**
 * @author Tyler Marois
 */
import React, { useEffect, useState } from "react";
import { path } from "../path";
import { useDrag } from "react-dnd";


export const JobCard = ({ crew, trucks, pickup, dropoff, customerId, type, job}) => {
    const [title, setTitle] = useState("");

    useEffect(() => {
        getTitle();
    }, []);

    const getTitle = async() => {
        const body = {
            id: customerId
        }
        try {
            const req = await fetch(path+"/trendsync/getcustomer", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const res = await req.json();
            
            const string = res.first_name + " " + res.last_name;
            setTitle(string);
        } catch (error) {
            console.log(error.message);
        }
    }

    const[{ isDragging }, dragRef] = useDrag({
        type: 'asset',
        item: {crew, trucks, pickup, dropoff, customerId, type, job},
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    return (
        <div className="flex flex-col justify-center items-center m-1" ref={dragRef}>
            <div className="bg-grey-200 w-[20vh] rounded-t-lg">
                <h1 className="text-white text-lg m-1">{title}</h1>
            </div>
            <div className=" border-y-2 border-black w-full flex flex-col justify-center">
                <div className="bg-background flex flex-col justify-center items-center">
                    <div className="flex items-center justify-between w-full px-1">
                        <h2 className="text-left text-sm">Number of Crew</h2>
                        <h2 className="text-right text-sm">{crew}</h2>
                    </div>
                </div>
                <div className="bg-background flex flex-col justify-center items-center">
                    <div className="flex items-center justify-between w-full px-1">
                        <h2 className="text-left text-sm">Number of Trucks</h2>
                        <h2 className="text-right text-sm">{trucks}</h2>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col justify-center bg-background rounded-b-lg p-1">
                <h2 className="text-xs w-[20ch] pb-1">{pickup}</h2>
                <h2 className="text-xs w-[20ch]">{dropoff}</h2>
            </div>
        </div>
    )
}