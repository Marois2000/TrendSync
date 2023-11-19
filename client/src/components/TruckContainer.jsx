/**
 * @author Tyler Marois
 */
import React, { useEffect, useState } from "react";
import { JobAsset } from "./jobasset";
import { path } from "../path";
import { useDrop } from "react-dnd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSliders } from '@fortawesome/free-solid-svg-icons'
import { EditTruckModel } from "./edittruckmodal";

export const TruckContainer = ({ trucks, setTrucks, date, schedule, setSchedule, setFullTrucks, fullTrucks}) => {
    const [editingTrucks, setEditingTrucks] = useState(false);
    const [trucksmodal, setTrucksModal] = useState(false);
    const [truckBeingEdited, setTruckBeingEdited] = useState({});

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

            setTrucks(res.notScheduled);
            setFullTrucks(res.allTrucks);
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

    const openModal = (truck) => {
        setTruckBeingEdited(truck);
        setTrucksModal(true);
    }

    return (
        <>
            <div className="flex flex-col rounded-lg w-[25vh]" ref={dropRef}>
                <div className="bg-secondary-200 rounded-t-lg flex px-3 justify-between">
                    <h2 className="text-white text-xl text-center">Trucks</h2>
                    <button className="text-white text-xl" onClick={() => setEditingTrucks(!editingTrucks)} ><FontAwesomeIcon icon={faSliders} /></button>
                </div>
                <div className="flex flex-col rounded-b-lg h-[35vh] bg-grey-100 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-white gap-2 items-start px-5">
                    {editingTrucks ?
                        (fullTrucks.map((truck, index) => {
                            return (
                                <div className="flex items-center justify-between w-full bg-grey-200">
                                    <h1 className="text-sm text-white font-bold">{truck.name}</h1>
                                    <button onClick={() => openModal(truck)} className="bg-primary text-white border-blue-700 border-2 px-2 z-30">Edit</button>
                                </div>
                            )
                        }))
                    :
                        (trucks.map((truck, index) => (
                            <JobAsset key={index} name={truck.name} type={'truck'} truck={truck} comingFromSlot={false} showDetail={true} />
                        )))
                    }
                </div>
            </div>

            {trucksmodal ? <EditTruckModel truck={truckBeingEdited} onClose={setTrucksModal} /> : null}
        </>
    )
}