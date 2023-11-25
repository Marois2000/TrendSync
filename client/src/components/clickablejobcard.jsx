/**
 * @author Tyler Marois
 */
import React, { useEffect, useState } from "react";
import { path } from "../path";

/**
 * @description A version of the job card that leads users to the edit job modal
 * 
 * @param {*} crew The jobs crew count
 * @param {*} trucks The jobs truck count
 * @param {*} customerId ID of the customer this job belongs to
 * @param {*} update The function passed to the button to do something
 * @returns A clickable job card for editing jobs
 */
export const ClickableJobCard = ({ crew, trucks, customerId, update }) => {
    const [title, setTitle] = useState(""); // The customers name becomes the title

    useEffect(() => {
        getTitle();
    }, []);

    /**
     * @description Call the API and get the customers name based of the customer's ID
     */
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

    return (
        <div className="flex flex-col justify-center items-center m-1 cursor-default w-[12vw] relative">
            <div className="bg-grey-200 w-[12vw] rounded-t-lg">
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
                <button onClick={update} className="bg-primary text-white border-blue-700 border-2 px-2 z-30">Edit</button>
            </div>
        </div>
    )
}