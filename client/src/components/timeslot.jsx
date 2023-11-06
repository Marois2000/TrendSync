/**
 * @author Tyler Marois
 */
import React, { useState } from "react";
import { JobAsset } from "./jobasset";
import { JobCard } from "./jobcard";
import { useDrag, useDrop } from "react-dnd";

export const TimeSlot = ({ index, crew, trucks, jobs, schedule, setSchedule}) => {
    const [crews, setCrews] = useState(crew);

    const[{ isOver }, dropRef] = useDrop({
        accept: 'asset',
        drop: (item) => handleDrop(item),
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    });

    const handleDrop = (item) => {
        let copyOfSlot = schedule[index];
        let updatedSchedule = [...schedule];

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

        updatedSchedule[index] = copyOfSlot;
        setSchedule(updatedSchedule);
    }



    return (
        <div className="flex bg-background border-b-2 border-black mt-3 w-[99%] z-10" ref={dropRef}>
            <div className="h-[20vh] w-[20vh] flex flex-col border-e-2 border-black">
                <div className="w-full bg-grey-200 flex justify-center ">
                    <h2 className="text-white text-sm">Crew</h2>
                </div>
                <div className="flex flex-wrap overflow-hidden">
                    {crew.map((crewMember) => {
                        return (
                            <JobAsset name={crewMember.last_name + ", " + crewMember.first_name} mini={true} index={index} type="crew" crew={crewMember}/>
                        )
                    })}

                </div>
            </div>
            <div className="h-[20vh] w-[15vh] flex flex-col border-e-2 border-black">
                <div className="w-full bg-grey-200 flex justify-center ">
                    <h2 className="text-white text-sm">Trucks</h2>
                </div>
                <div className="flex flex-wrap overflow-hidden">
                    {trucks.map((truck) => {
                        return (
                            <JobAsset index={index} name={truck.name} mini={true} type="truck" truck={truck}/>
                        )
                    })}
                </div>
            </div>
            <div className="w-full flex rounded-e-lg h-[20vh] bg-grey-100 overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-white gap-2 px-2">
                    {jobs.map((job) => {
                        return (
                            <JobCard index={index} crew={job.num_crew} trucks={job.num_trucks} pickup={job.pickup} dropoff={job.dropoff} customerId={job.customer_id} type="job" job={job}/>
                        )
                    })}

            </div>
        </div>
    )
}