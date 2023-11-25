/**
 * @author Tyler Marois
 */
import React, { useEffect, useState } from "react";
import { path } from "../path";
import { useDrag } from "react-dnd";

/**
 * @description A draggable job card
 * 
 * @param {*} crew The number of crew on the job
 * @param {*} trucks The number of trucks on the job
 * @param {*} pickup The pickup address for the job
 * @param {*} dropoff The dropoff address for the job
 * @param {*} customerId The customer's ID for this job
 * @param {*} type The job cards type
 * @param {*} job The job data
 * @param {*} index The index of where it came from
 * @param {*} comingFromSlot If it's coming from the schedule or not
 * 
 * @returns A draggable job card containing job details
 */
export const JobCard = ({ crew, trucks, pickup, dropoff, customerId, type, job, index, comingFromSlot }) => {
    const [title, setTitle] = useState(""); // The title of the job, this is the customers name
    const [details, setDetails] = useState(false); // If the jobs details are open or not

    useEffect(() => {
        getTitle();
    }, []);

    /**
     * Calls the API and gets the jobs title/customer name
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

    const[{ isDragging }, dragRef] = useDrag({
        type: 'asset',
        item: {crew, trucks, pickup, dropoff, customerId, type, job, index, comingFromSlot},
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }); // Allows for dragging of the card

    return (
        <div className="flex flex-col justify-center items-center m-1 cursor-grab w-[12vw] relative" ref={dragRef} onMouseEnter={() => setDetails(true)} onMouseLeave={() => setDetails(false)}>
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
                <h2 className="text-xs w-[20ch] pb-1">{pickup}</h2>
                <h2 className="text-xs w-[20ch]">{dropoff}</h2>
            </div>

            {details ? 
                <div className="absolute right-[-10rem] bg-grey-200 rounded-lg overflow-hidden border-black border-2 z-20">
                    <h1 className="text-white text-sm text-center w-full bg-primary">Details</h1>
                    <div className="flex justify-between items-center w-full gap-5">
                        <h1 className="text-white text-xs">Rate:</h1>
                        <h1 className="text-white text-xs">{job.rate}</h1>
                    </div>
                    <div className="flex justify-between items-center w-full gap-5">
                        <h1 className="text-white text-xs">Estimate:</h1>
                        <h1 className="text-white text-xs">{job.estimate}</h1>
                    </div>
                    <div className="flex justify-between items-center w-full gap-5">
                        <h1 className="text-white text-xs">Complete:</h1>
                        <h1 className="text-white text-xs">{job.complete ? "Complete" : "Incomplete"}</h1>
                    </div>
                </div>  
            : null}
        </div>
    )
}