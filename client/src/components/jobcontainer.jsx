/**
 * @author Tyler Marois
 */
import React, { useState, useEffect} from "react";
import { JobCard } from "./jobcard";
import { path } from "../path";
import { useDrop } from "react-dnd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSliders } from '@fortawesome/free-solid-svg-icons'
import { ClickableJobCard } from "./clickablejobcard";
import { EditJobModal } from "./editjobmodal";

/**
 * @description A job container that holds job cards
 * 
 * @param {*} jobs The array of jobs that are not on the schedule
 * @param {*} setJobs Sets the jobs array
 * @param {*} date The given date
 * @param {*} schedule The given schedule
 * @param {*} setSchedule Sets the given schedule
 * @param {*} setFullJobs Sets the full jobs array
 * @param {*} fullJobs The array of all the jobs on this date, even if they're on the schedule
 * @param {*} setDate Sets the date
 * 
 * @returns 
 */
export const JobContainer = ({ jobs, setJobs, date, schedule, setSchedule, setFullJobs, fullJobs, setDate }) => {
    const [editingJobs, setEditingJobs] = useState(false); // Determines if editing jobs or not
    const [jobsmodal, setJobsModal] = useState(false); // Determines if the edit job modal is open or not
    const [jobBeingEdited, setJobBeingEdited] = useState({}); // The job being edited

    useEffect(() => {
        getJobs();
    }, [date]);

    /**
     * @description Calls the API and gets the jobs
     */
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

            setJobs(res.jobsScheduled);
            setFullJobs(res.allJobs);
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
    }); // Allows for dropping

    /**
     * @description Handles the dropping of a job card into the container
     * 
     * @param {*} item The job to be dropped in
     */
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

    /**
     * @description Calls the API and gets the job title/customer name
     * 
     * @param {*} customerId The customers ID for this job
     * 
     * @returns The title of a job as a string
     */
    const getTitle = async(customerId) => {
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
            return string;
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * @description Sets the job being edited and opens the job edit modal
     * 
     * @param {*} job The job to be edited
     */
    const openModal = (job) => {
        setJobBeingEdited(job);
        setJobsModal(true);
    }

    return (
        <>
            <div className="flex rounded-lg mx-5 my-2" ref={dropRef}>
                <div className="bg-secondary-200 rounded-s-lg h-[20vh] flex justify-around items-center flex-col">
                    <h2 className="text-white text-xl text-center m-2">Jobs</h2>
                    <button className="text-white text-xl" onClick={() => setEditingJobs(!editingJobs)} ><FontAwesomeIcon icon={faSliders} /></button>
                </div>
                    <div className="w-full flex rounded-e-lg h-[20vh] bg-grey-100 overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-white gap-2 ">
                        
                        {editingJobs ? 
                            (fullJobs.map((job, index) => {
                                return (
                                    <ClickableJobCard crew={job.num_crew} trucks={job.num_trucks} pickup={job.pickup} dropoff={job.dropoff} customerId={job.customer_id} update={() => openModal(job)} />
                                )
                            }))
                        : 
                            (jobs.map((job) => {
                                return(
                                    <JobCard crew={job.num_crew} trucks={job.num_trucks} pickup={job.pickup} dropoff={job.dropoff} customerId={job.customer_id} type={'job'} job={job} comingFromSlot={false} />
                                )
                            }))
                        }
                        

                    </div>
            </div>

            {jobsmodal ? <EditJobModal job={jobBeingEdited} onClose={setJobsModal} setGlobalDate={setDate} /> : null}

        </>
    )
}