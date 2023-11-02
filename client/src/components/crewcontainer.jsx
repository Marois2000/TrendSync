/**
 * @author Tyler Marois
 */
import React, { useState, useEffect } from "react";
import { JobAsset } from "./jobasset";

export const CrewContainer = () => {
    const [crews, setCrews] = useState([]);

    

    const getCrewMembers = async() => {
        
    }
    
      


    return(
        <div className="flex flex-col rounded-lg w-[25vh]">
            <div className="bg-secondary-200 rounded-t-lg">
                <h2 className="text-white text-xl text-center">Crew</h2>
            </div>
            <div className="flex flex-col rounded-b-lg h-[35vh] bg-grey-100 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-white gap-2 items-center ">
                {crews.map((crew) => {
                    return(
                        <JobAsset name={crew.last_name + ", " + crew.first_name}/>   
                    )
                })}
            </div>
        </div>
    )
}