/**
 * @author Tyler Marois
 */
import React from "react";
import { JobAsset } from "./jobasset";

export const CrewContainer = () => {

    const crews = [
        { first_name: "Sarah", last_name: "Johnson" },
        { first_name: "Michael", last_name: "Williams" },
        { first_name: "Emily", last_name: "Brown" },
        { first_name: "James", last_name: "Davis" },
        { first_name: "Olivia", last_name: "Wilson" },
        { first_name: "Robert", last_name: "Martinez" },
        { first_name: "Sophia", last_name: "Anderson" },
        { first_name: "William", last_name: "Taylor" },
        { first_name: "Ava", last_name: "Thomas" },
        { first_name: "Joseph", last_name: "Hernandez" },
        { first_name: "Mia", last_name: "Moore" },
        { first_name: "David", last_name: "Lopez" },
        { first_name: "Emma", last_name: "Garcia" },
        { first_name: "Charles", last_name: "Miller" },
        { first_name: "Sofia", last_name: "Jackson" },
        { first_name: "Matthew", last_name: "White" },
        { first_name: "Ella", last_name: "Martin" },
        { first_name: "Daniel", last_name: "Thompson" },
        { first_name: "Grace", last_name: "Clark" }
      ];
      


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