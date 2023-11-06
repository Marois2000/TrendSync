/**
 * @author Tyler Marois
 */
import React, { useState, useEffect } from "react";
import { JobAsset } from "./jobasset";
import { path } from "../path";
import { useDrop } from "react-dnd";

export const CrewContainer = ({ crews, setCrew, date, schedule, setSchedule }) => {

    useEffect(() => {
        getCrewMembers();
    }, [date]);

    const getCrewMembers = async() => {
        const body = {
            date: date
        }
        try {
            const req = await fetch(path+"/trendsync/getcrew", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const res = await req.json();

            setCrew(res);
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
        let crewList = copyOfSlot.crew;
        let updatedSchedule = [...schedule];

        if(item.type == 'crew') {

            let newCrew = crewList.filter((crew) => crew != item.crew);

            copyOfSlot = {
                jobid: copyOfSlot.jobid,
                crew: newCrew,
                trucks: copyOfSlot.trucks
            }
            
            updatedSchedule[item.index] = copyOfSlot;
            setSchedule(updatedSchedule);
            setCrew([...crews, item.crew]);
        } 
    }
    
      


    return(
        <div className="flex flex-col rounded-lg w-[25vh]" ref={dropRef}>
            <div className="bg-secondary-200 rounded-t-lg">
                <h2 className="text-white text-xl text-center">Crew</h2>
            </div>
            <div className="flex flex-col rounded-b-lg h-[35vh] bg-grey-100 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-white gap-2 items-center ">
                {crews.length === 0 ? (
                    <div className="spinner animate-ping">Loading...</div>
                ) : (
                    crews.map((crew, index) => (
                    <JobAsset key={index} name={crew.last_name + ", " + crew.first_name} type={'crew'} crew={crew}/>
                    ))
                )}
            </div>
        </div>
    )
}