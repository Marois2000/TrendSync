/**
 * @author Tyler Marois
 */
import React, { useState } from "react";
import { CrewContainer } from "../components/crewcontainer";
import { TruckContainer } from "../components/TruckContainer";
import { Schedule } from "../components/schedule";
import { JobContainer } from "../components/jobcontainer";

export const JobBoard = () => {
    const initDate = new Date();
    const [date, setDate] = useState(initDate.getFullYear() + "-" + initDate.getMonth() + "-" + initDate.getDate());
    const [crews, setCrew] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [schedule, setSchedule] = useState([]);


    return (
        <div className="flex w-full">
            <div className="flex flex-col ml-3 gap-5 mt-5">
                <CrewContainer crews={crews} setCrew={setCrew} date={date}/>
                <TruckContainer trucks={trucks} setTrucks={setTrucks} date={date} />
            </div>
            <div className="w-full">
                <div>
                    <Schedule date={date} setDate={setDate} schedule={schedule} setSchedule={setSchedule}/>
                </div>
                <div>
                    <JobContainer jobs={jobs} setJobs={setJobs} date={date} />
                </div>
            </div>
            
        </div>
    )
}