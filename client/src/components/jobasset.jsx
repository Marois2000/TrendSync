/**
 * @author Tyler Marois
 */
import React, { useState } from "react";
import { useDrag } from "react-dnd";

export const JobAsset = ({ name, mini, type, crew, truck, index, comingFromSlot, showDetail }) => {
    const [details, setDetails] = useState(false);

    const style = mini ? 
    "rounded-3xl flex justify-center items-center bg-white h-[4vh] drop-shadow-md p-1 cursor-grab" 
    : "rounded-3xl flex justify-center items-center bg-white h-[4vh] drop-shadow-md p-3 cursor-grab";

    const[{ isDragging }, dragRef] = useDrag({
        type: 'asset',
        item: {name, mini, type, crew, truck, index, comingFromSlot},
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    

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