/**
 * @author Tyler Marois
 */
import React, { useState } from "react";
import { useDrag } from "react-dnd";

/**
 * @description A draggable item that contains either crew member or truck information
 * 
 * @param {*} name The name being displayed
 * @param {*} mini If it should be normal sized or small sized
 * @param {*} type If its a crew member or truck
 * @param {*} crew The crew member, if it is a crew member
 * @param {*} truck The truck, if it is a truck
 * @param {*} index Assets index in it's original array
 * @param {*} comingFromSlot If its coming from a slot in the schedule or not
 * @param {*} showDetail If the asset should show its details or not
 * 
 * @returns A draggable item containing job asset data
 */
export const JobAsset = ({ name, mini, type, crew, truck, index, comingFromSlot, showDetail }) => {
    const [details, setDetails] = useState(false); // If the assets details should be open or not

    const style = mini ? 
    "rounded-3xl flex justify-center items-center bg-white h-[4vh] drop-shadow-md p-1 cursor-grab" 
    : "rounded-3xl flex justify-center items-center bg-white h-[4vh] drop-shadow-md p-3 cursor-grab"; // Styles depending on mini prop

    const[{ isDragging }, dragRef] = useDrag({
        type: 'asset',
        item: {name, mini, type, crew, truck, index, comingFromSlot},
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }); // Allows for dragging of the asset

    return(
        <div className={style} ref={dragRef} onMouseEnter={() => setDetails(true)} onMouseLeave={() => setDetails(false)}>
            <h3 className="text-black text-xs">{name}</h3>
            {details && showDetail ? 
                (type == 'truck' ? 
                    <div className="absolute left-[4rem] bg-grey-200 rounded-lg overflow-hidden">
                        <h1 className="text-white text-sm text-center w-full bg-primary">Details</h1>
                        <div className="flex justify-between items-center w-full gap-5">
                            <h1 className="text-white text-xs">Length:</h1>
                            <h1 className="text-white text-xs">{truck.length}</h1>
                        </div>
                        <div className="flex justify-between items-center w-full gap-5">
                            <h1 className="text-white text-xs">Model:</h1>
                            <h1 className="text-white text-xs">{truck.model}</h1>
                        </div>
                    </div> 
                :   <div className="absolute right-[-4rem] bg-grey-200 rounded-lg overflow-hidden ">
                        <h1 className="text-white text-sm text-center w-full bg-primary">Details</h1>
                        <div className="flex justify-between items-center w-full gap-5">
                            <h1 className="text-white text-xs">Rank:</h1>
                            <h1 className="text-white text-xs">{crew.rank}</h1>
                        </div>
                    </div> 
                )
                

            : null}
            
        </div>
    )
}