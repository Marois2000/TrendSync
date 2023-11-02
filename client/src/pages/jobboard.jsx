/**
 * @author Tyler Marois
 */
import React from "react";
import { CrewContainer } from "../components/crewcontainer";
import { TruckContainer } from "../components/TruckContainer";

export const JobBoard = () => {
    return (
        <div className="flex">
            <div className="flex flex-col ml-3 gap-5 mt-5">
                <CrewContainer />
                <TruckContainer />
            </div>
            
        </div>
    )
}