/**
 * @author Tyler Marois
 */
import React from "react";
import { useDrag } from "react-dnd";

export const JobAsset = ({ name, mini, type, crew, truck, index, comingFromSlot }) => {
    const style = mini ? 
    "rounded-3xl flex justify-center items-center bg-white h-[4vh] drop-shadow-md p-1 cursor-grab" 
    : "rounded-3xl flex justify-center items-center bg-white h-[4vh] drop-shadow-md p-3 cursor-grab ";

    const[{ isDragging }, dragRef] = useDrag({
        type: 'asset',
        item: {name, mini, type, crew, truck, index, comingFromSlot},
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    return(
        <div className={style} ref={dragRef} >
            <h3 className="text-black text-xs">{name}</h3>
        </div>
    )
}