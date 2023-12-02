/**
 * @author Tyler Marois
 */
import React, { useState, useEffect } from "react";
import { CrewContainer } from "../components/crewcontainer";
import { TruckContainer } from "../components/TruckContainer";
import { Schedule } from "../components/schedule";
import { JobContainer } from "../components/jobcontainer";

/**
 * @description The job board page where admins can see Crew, trucks, and jobs on a given day as well as set schedules
 * 
 * @returns A scheduling page with drag and drop
 */
export const JobBoard = () => {
    const today = new Date(); // Todays date
    const year = today.getFullYear(); // Get the dates year
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Get the dates month and pad start with a 0 if necessary
    const day = String(today.getDate()).padStart(2, '0'); // Get the date and pad start with a 0 if necessary
    const stringDate = year + "-" + month + "-" + day; // Turn all those into one string of the date in html date format

    const [date, setDate] = useState(stringDate); // The current date in html required format
    const [crews, setCrew] = useState([]); // All the users/crew members not on a job
    const [trucks, setTrucks] = useState([]); // All trucks not on a job
    const [jobs, setJobs] = useState([]); // All jobs not in the schedule
    const [schedule, setSchedule] = useState([]); // Schedule containing timeslots that tell who is on what job and in which truck

    const [fullCrew, setFullCrew] = useState([]); // All the users/crew members 
    const [fullTrucks, setFullTrucks] = useState([]); // All the trucks
    const [fullJobs, setFullJobs] = useState([]); // All the jobs


    useEffect(() => {
        filterCrew();
        filterTrucks();
        filterJobs();

    }, [schedule]);

    
    /**
     * @description Filters the crew once the schedule gets updated
     */
    const filterCrew = () => {
        const everyone = fullCrew;
        let usersOnSchedule = [];
        schedule.forEach((timeslot) => {
            const crew = timeslot.crew;
            crew.forEach(crewMember => {
                if(!usersOnSchedule.includes(crewMember.user_id)) {
                    usersOnSchedule = [...usersOnSchedule, crewMember];
                }
            });
        });

        let usersNotOnSchedule = everyone.filter(crewMember => {
            return !usersOnSchedule.some(user => user.user_id === crewMember.user_id);
        });


        setCrew(usersNotOnSchedule);
    }

    /**
     * @description Sets the trucks once the schedule gets updated
     */
    const filterTrucks = () => {
        const allTrucks = fullTrucks
        let trucksOnSchedule = [];
        schedule.forEach((timeslot) => {
            const trucks = timeslot.trucks;
            trucks.forEach(truck => {
                if(!trucksOnSchedule.includes(truck.truck_id)) {
                    trucksOnSchedule = [...trucksOnSchedule, truck];
                }
            });
        });

        let trucksNotOnSchedule = allTrucks.filter(truck => {
            return !trucksOnSchedule.some(truckOnSchedule => truckOnSchedule.truck_id === truck.truck_id);
        });

        setTrucks(trucksNotOnSchedule);
    }

    /**
     * @description Sets the jobs once the schedule gets updated
     */
    const filterJobs = () => {
        const allJobs = fullJobs;
        let jobsOnSchedule = [];
        schedule.forEach((timeslot) => {
            const jobs = timeslot.jobid;
            jobs.forEach(job => {
                if(!jobsOnSchedule.includes(job.job_id)) {
                    jobsOnSchedule = [...jobsOnSchedule, job];
                }
            });
        });

        let jobsNotOnSchedule = allJobs.filter(job => {
            return !jobsOnSchedule.some(jobOnSchedule => jobOnSchedule.job_id === job.job_id);
        });

        setJobs(jobsNotOnSchedule);
    }

    return (
        <div className="flex w-full">
            <div className="flex flex-col ml-3 gap-5 mt-5">
                <CrewContainer crews={crews} setCrew={setCrew} date={date} schedule={schedule} setSchedule={setSchedule} setFullCrew={setFullCrew} fullCrew={fullCrew} />
                <TruckContainer trucks={trucks} setTrucks={setTrucks} date={date} schedule={schedule} setSchedule={setSchedule} setFullTrucks={setFullTrucks} fullTrucks={fullTrucks}/>
            </div>
            <div className="w-full">
                <div>
                    <Schedule date={date} setDate={setDate} schedule={schedule} setSchedule={setSchedule} allAssets={[fullCrew, fullTrucks, filterJobs]} setCrew={setCrew} setJobs={setJobs} setTrucks={setTrucks} />
                </div>
                <div>
                    <JobContainer jobs={jobs} setJobs={setJobs} date={date} schedule={schedule} setSchedule={setSchedule} setFullJobs={setFullJobs} fullJobs={fullJobs} setDate={setDate} />
                </div>
            </div>
            
        </div>
    )
}