/**
 * @author Tyler Marois
 */
import React, { useState, useEffect} from "react";
import { JobCard } from "./jobcard";
import { path } from "../path";

export const JobContainer = ({ jobs, setJobs, date}) => {

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

    return (
        <div className="flex rounded-lg m-5">
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