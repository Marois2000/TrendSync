/**
 * @author Tyler Marois
 */
import React, { useEffect, useState } from "react";
import { JobAsset } from "./jobasset";
import { JobCard } from "./jobcard";
import { useDrop } from "react-dnd";

/**
 * @description A time slot in the schedule, holds crews, trucks, and jobs
 * 
 * @param {*} index The timeslots index in the schedule
 * @param {*} crew Array of crew members in this slot
 * @param {*} trucks The array of trucks in this slot
 * @param {*} jobs The array of jobs in this slot
 * @param {*} schedule The entire schedule
 * @param {*} setSchedule Sets the entire schedule
 * 
 * @returns A container that holds crew members, trucks, and jobs that are all in a timeslot
 */
export const TimeSlot = ({ index, crew, trucks, jobs, schedule, setSchedule }) => {
    const [fullSlot, setFullSlot] = useState(false); // Determines whether or not the crew and trucks are sufficient for the jobs in the slot

    useEffect(() => {
        checkFull();
    }, [crew, trucks, jobs])

    /**
     * @description Checks if a slot is full
     */
    const checkFull = () => {
        let totalCrewNeeded = 0;
        let totalTrucksNeeded = 0;
        jobs.forEach(job => {
            totalCrewNeeded = Math.max(totalCrewNeeded, job.num_crew);
            totalTrucksNeeded = Math.max(totalTrucksNeeded, job.num_trucks);
        });

        if(totalCrewNeeded <= crew.length && totalTrucksNeeded <= trucks.length && jobs.length > 0) {
            setFullSlot(true);
        } else {
            setFullSlot(false)
        }
    }

    const[{ isOver }, dropRef] = useDrop({
        accept: 'asset',
        drop: (item) => handleDrop(item),
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    }); // Allows for dropping items

    /**
     * @description Drops an item into whichever container in the slot the item is meant for
     * 
     * @param {*} item The item being dropped
     */
    const handleDrop = (item) => {
        let copyOfSlot = schedule[index];
        let updatedSchedule = [...schedule];

        if(!item.comingFromSlot) {
            if(item.type == 'crew') {
                copyOfSlot = {
                    jobid: copyOfSlot.jobid,
                    crew: [... copyOfSlot.crew, item.crew],
                    trucks: copyOfSlot.trucks
                }
                
            } else if(item.type == 'truck') {
                copyOfSlot = {
                    jobid: copyOfSlot.jobid,
                    crew: copyOfSlot.crew,
                    trucks: [...copyOfSlot.trucks, item.truck]
                }
            } else if(item.type == 'job') {
                copyOfSlot = {
                    jobid: [...copyOfSlot.jobid, item.job],
                    crew: copyOfSlot.crew,
                    trucks: copyOfSlot.trucks
                }
            }
        }
        
        checkFull();

        updatedSchedule[index] = copyOfSlot;
        setSchedule(updatedSchedule);
    }

    /**
     * @description Deletes a slot from the schedule
     */
    const removeSlot = () => {
        setSchedule(schedule.filter((slot) => slot != schedule[index]));
    }

    return (
        <div className="flex bg-background border-b-2 border-black mt-3 w-[99%] z-10 rounded-lg" ref={dropRef}>
            <div className="h-[25vh] w-[30vh] flex flex-col border-e-2 border-black">
                <div className={fullSlot ? "w-full bg-green-500 flex justify-center" : "w-full bg-grey-200 flex justify-center"}>
                    <h2 className="text-white text-sm">Crew</h2>
                </div>
                <div className="flex flex-wrap overflow-hidden">
                    {crew.map((crewMember) => {
                        return (
                            <JobAsset name={crewMember.last_name + ", " + crewMember.first_name} mini={true} index={index} type="crew" crew={crewMember} comingFromSlot={true}/>
                        )
                    })}

                </div>
            </div>
            <div className="h-[25vh] w-[15vh] flex flex-col border-e-2 border-black">
                <div className={fullSlot ? "w-full bg-green-500 flex justify-center" : "w-full bg-grey-200 flex justify-center"}>
                    <h2 className="text-white text-sm">Trucks</h2>
                </div>
                <div className="flex flex-wrap overflow-hidden">
                    {trucks.map((truck) => {
                        return (
                            <JobAsset index={index} name={truck.name} mini={true} type="truck" truck={truck} comingFromSlot={true}/>
                        )
                    })}
                </div>
            </div>
            <div className="w-full flex h-[25vh] bg-grey-100 overflow-hidden overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-white gap-2 px-2">
                    {jobs.map((job) => {
                        return (
                            <JobCard index={index} crew={job.num_crew} trucks={job.num_trucks} pickup={job.pickup} dropoff={job.dropoff} customerId={job.customer_id} type="job" job={job} comingFromSlot={true}/>
                        )
                    })}
            </div>
            <div className="bg-background h-[25vh] w-[15vh] flex flex-col justify-center rounded-r-lg border-t-2 border-r-2 border-black">
                <button className="bg-red-600 text-white border-red-900 border-2 m-2" onClick={removeSlot}>Delete</button>
            </div>
        </div>
    )
}