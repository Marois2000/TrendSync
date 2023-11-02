/**
 * @author Tyler Marois
 */
import React from "react";
import { JobAsset } from "./jobasset";


export const TruckContainer = () => {

    const trucks = [
        "NH1",
        "NH2",
        "NH3",
        "NH4",
        "NH5",
        "NH6",
        "NH7",
        "NH8",
        "NH9",
        "NH10"
      ];

    return (
        <div className="flex flex-col rounded-lg w-[25vh]">
            <div className="bg-secondary-200 rounded-t-lg">
                <h2 className="text-white text-xl text-center">Trucks</h2>
            </div>
            <div className="flex flex-col rounded-b-lg h-[35vh] bg-grey-100 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-white gap-2 items-center">
                {trucks.map((truck) => {
                    return(
                        <JobAsset name={truck}/>   
                    )
                })}
            </div>
        </div>
    )
}