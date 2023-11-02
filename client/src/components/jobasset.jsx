/**
 * @author Tyler Marois
 */
import React from "react";

export const JobAsset = ({ name }) => {
    return(
        <div className="rounded-3xl flex justify-center items-center bg-white h-[4vh] p-3 drop-shadow-md w-[75%]">
            <h3 className="text-black text-xs">{name}</h3>
        </div>
    )
}