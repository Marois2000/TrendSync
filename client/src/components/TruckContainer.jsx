/**
 * @author Tyler Marois
 */
import React, { useEffect } from "react";
import { JobAsset } from "./jobasset";
import { path } from "../path";
import { useDrop } from "react-dnd";

export const TruckContainer = ({ trucks, setTrucks, date, schedule, setSchedule}) => {

    useEffect(() => {
        getTrucks();
    }, [date]);


    const getTrucks = async() => {
        const body = {
            date: date
        }
        try {
            const req = await fetch(path+"/trendsync/gettrucks", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const res = await req.json();

            setTrucks(res);
        } catch (error) {
            console.log(error);
        }
    }

    const[{ isOver }, dropRef] = useDrop({
        accept: 'asset',
        drop: (item) => handleDrop(item),
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    });

    const handleDrop = (item) => {
        let copyOfSlot = schedule[item.index];
        let truckList = copyOfSlot.trucks;
        let updatedSchedule = [...schedule];

        if(item.type == 'truck') {

            let newTrucks = truckList.filter((truck) => truck != item.truck);

            copyOfSlot = {
                jobid: copyOfSlot.jobid,
                crew: copyOfSlot.crew,
                trucks: newTrucks
            }
            
            updatedSchedule[item.index] = copyOfSlot;
            setSchedule(updatedSchedule);
            setTrucks([...trucks, item.truck]);
        } 
    }

    return (
        <div className="flex flex-col rounded-lg w-[25vh]" ref={dropRef}>
            <div className="bg-secondary-200 rounded-t-lg">
                <h2 className="text-white text-xl text-center">Trucks</h2>
            </div>
            <div className="flex flex-col rounded-b-lg h-[35vh] bg-grey-100 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-white gap-2 items-center">
                {trucks.length === 0 ? (
                    <div className="spinner animate-ping">Loading...</div>
                ) : (
                    trucks.map((truck, index) => (
                        <JobAsset key={index} name={truck.name} type={'truck'} truck={truck} />
                    ))
                )}
            </div>
        </div>
    )
}