/**
 * @author Tyler Marois
 */
import React, { useState, useEffect } from "react";
import { CrewContainer } from "../components/crewcontainer";
import { TruckContainer } from "../components/TruckContainer";
import { Schedule } from "../components/schedule";
import { JobContainer } from "../components/jobcontainer";

export const JobBoard = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const stringDate = year + "-" + month + "-" + day;

    const [date, setDate] = useState(stringDate);
    const [crews, setCrew] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        filterCrew();
        filterTrucks();
        filterJobs();

    }, [schedule]);
    
    const filterCrew = () => {
        let usersOnSchedule = [];
        schedule.forEach((timeslot) => {
            const crew = timeslot.crew;
            crew.forEach(crewMember => {
                if(!usersOnSchedule.includes(crewMember.user_id)) {
                    usersOnSchedule = [...usersOnSchedule, crewMember];
                }
            });
        });

        let usersNotOnSchedule = crews.filter(crewMember => {
            return !usersOnSchedule.some(user => user.user_id === crewMember.user_id);
        });

        setCrew(usersNotOnSchedule);
    }

    const filterTrucks = () => {
        let trucksOnSchedule = [];
        schedule.forEach((timeslot) => {
            const trucks = timeslot.trucks;
            trucks.forEach(truck => {
                if(!trucksOnSchedule.includes(truck.truck_id)) {
                    trucksOnSchedule = [...trucksOnSchedule, truck];
                }
            });
        });

        let trucksNotOnSchedule = trucks.filter(truck => {
            return !trucksOnSchedule.some(truckOnSchedule => truckOnSchedule.truck_id === truck.truck_id);
        });

        setTrucks(trucksNotOnSchedule);
    }

    const filterJobs = () => {
        let jobsOnSchedule = [];
        schedule.forEach((timeslot) => {
            const jobs = timeslot.jobid;
            jobs.forEach(job => {
                if(!jobsOnSchedule.includes(job.job_id)) {
                    jobsOnSchedule = [...jobsOnSchedule, job];
                }
            });
        });

        let jobsNotOnSchedule = jobs.filter(job => {
            return !jobsOnSchedule.some(jobOnSchedule => jobOnSchedule.job_id === job.job_id);
        });

        setJobs(jobsNotOnSchedule);
    }

    const getTodaysDate = () => {
        
    }

    return (
        <div className="flex w-full">
            <div className="flex flex-col ml-3 gap-5 mt-5">
                <CrewContainer crews={crews} setCrew={setCrew} date={date} schedule={schedule} setSchedule={setSchedule} />
                <TruckContainer trucks={trucks} setTrucks={setTrucks} date={date} schedule={schedule} setSchedule={setSchedule}/>
            </div>
            <div className="w-full">
                <div>
                    <Schedule date={date} setDate={setDate} schedule={schedule} setSchedule={setSchedule}/>
                </div>
                <div>
                    <JobContainer jobs={jobs} setJobs={setJobs} date={date} schedule={schedule} setSchedule={setSchedule} />
                </div>
            </div>
            
        </div>
    )
}