/**
 * @author Tyler Marois
 */
import React, { useState, useEffect} from "react";
import { JobCard } from "./jobcard";
import { path } from "../path";
import { useDrop } from "react-dnd";


export const JobContainer = ({ jobs, setJobs, date, schedule, setSchedule}) => {

    useEffect(() => {
        getJobs();
    }, [date]);


    const getJobs = async() => {
        const body = {
            date: date
        }
        try {
            const req = await fetch(path+"/trendsync/getjobs", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const res = await req.json();

            setJobs(res);
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
        let jobsList = copyOfSlot.jobid;
        let updatedSchedule = [...schedule];

        if(item.type == 'job') {

            let newJobs = jobsList.filter((job) => job != item.job);

            copyOfSlot = {
                jobid: newJobs,
                crew: copyOfSlot.crew,
                trucks: copyOfSlot.trucks
            }
            
            updatedSchedule[item.index] = copyOfSlot;
            setSchedule(updatedSchedule);
            setJobs([...jobs, item.job]);
        } 
    }

    return (
        <div className="flex rounded-lg mx-5 my-2" ref={dropRef}>
            <div className="bg-secondary-200 rounded-s-lg h-[20vh] flex justify-center items-center">
                <h2 className="text-white text-xl text-center m-2">Jobs</h2>
            </div>
                <div className="w-full flex rounded-e-lg h-[20vh] bg-grey-100 overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-white gap-2 ">
                    {jobs.map((job) => {
                        return(
                            <JobCard crew={job.num_crew} trucks={job.num_trucks} pickup={job.pickup} dropoff={job.dropoff} customerId={job.customer_id} type={'job'} job={job} />
                            
                        )
                    })}

                </div>
        </div>
    )
}