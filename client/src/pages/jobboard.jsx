/**
 * @author Tyler Marois
 */
import React, { useState } from "react";
import { CrewContainer } from "../components/crewcontainer";
import { TruckContainer } from "../components/TruckContainer";
import { Schedule } from "../components/schedule";

export const JobBoard = () => {
    const [date, setDate] = useState("");

    return (
        <div className="flex w-full">
            <div className="flex flex-col ml-3 gap-5 mt-5">
                <CrewContainer />
                <TruckContainer />
            </div>
            <div className="w-full">
                <Schedule date={date} setDate={setDate}/>
            </div>
        </div>
    )
}