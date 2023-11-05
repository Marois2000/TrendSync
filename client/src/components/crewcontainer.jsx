/**
 * @author Tyler Marois
 */
import React, { useState, useEffect } from "react";
import { JobAsset } from "./jobasset";
import { path } from "../path";

export const CrewContainer = ({ crews, setCrew, date }) => {

    useEffect(() => {
        getCrewMembers();
    }, [date]);


    const getCrewMembers = async() => {
        const body = {
            date: date
        }
        try {
            const req = await fetch(path+"/trendsync/getcrew", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const res = await req.json();

            setCrew(res);
        } catch (error) {
            console.log(error);
        }
    }
    
      


    return(
        <div className="flex flex-col rounded-lg w-[25vh]">
            <div className="bg-secondary-200 rounded-t-lg">
                <h2 className="text-white text-xl text-center">Crew</h2>
            </div>
            <div className="flex flex-col rounded-b-lg h-[35vh] bg-grey-100 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-white gap-2 items-center ">
                {crews.length === 0 ? (
                    <div className="spinner animate-ping">Loading...</div>
                ) : (
                    crews.map((crew, index) => (
                    <JobAsset key={index} name={crew.last_name + ", " + crew.first_name} type={'crew'} crew={crew}/>
                    ))
                )}
            </div>
        </div>
    )
}