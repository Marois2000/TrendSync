/**
 * @author Tyler Marois
 */
import React, { useEffect, useState } from "react";
import { JobAsset } from "./jobasset";
import { JobCard } from "./jobcard";
import { useDrag, useDrop } from "react-dnd";

export const TimeSlot = ({ index, crew, trucks, jobs, schedule, setSchedule, setCrew, setTrucks, setJobs, allAssets}) => {
    const [fullSlot, setFullSlot] = useState(false);

    useEffect(() => {
        checkFull();
    }, [crew, trucks, jobs])

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
    });

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

    const removeSlot = () => {

        setSchedule(schedule.filter((slot) => slot != schedule[index]));


        // console.log(crews);
        // console.log(allTrucks);
        // console.log(allJobs);

        //setCrew(...allAssets[0], ...crew);
        
        console.log(schedule);
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
            <div className="w-full max-w-[47vw] flex h-[25vh] bg-grey-100 overflow-hidden overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-white gap-2 px-2">
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