/**
 * @author Tyler Marois
 */
import React, { useState, useEffect } from "react";
import { JobAsset } from "./jobasset";
import { path } from "../path";
import { useDrop } from "react-dnd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSliders } from '@fortawesome/free-solid-svg-icons'
import { EditCrewModel } from "./editcrewmodal";

/**
 * @description Contains all the crew available to go on jobs
 * 
 * @param {*} crews Array of crew objects that are not on a job
 * @param {*} setCrew Sets the crew array
 * @param {*} date The given date
 * @param {*} schedule The current schedule
 * @param {*} setSchedule Sets the current schedule
 * @param {*} fullCrew Array of all crew even those on jobs
 * @param {*} setFullCrew Sets the full crew
 * 
 * @returns A container that holds draggable crew memebers
 */
export const CrewContainer = ({ crews, setCrew, date, schedule, setSchedule, setFullCrew, fullCrew }) => {
    const [editingCrew, setEditingCrew] = useState(false); // Tells if we are currently editing crew or not
    const [crewmodal, setCrewModal] = useState(false); // Tells if the edit crew modal should be open or not
    const [crewMemberBeingEdited, setCrewMemberBeingEdited] = useState({}); // The current crew member that is being edited

    useEffect(() => {
        getCrewMembers();
    }, [date]);

    /**
     * @description Calls the API and gets the crew members
     */
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

            setCrew(res.notScheduled);
            setFullCrew(res.everyone);
        } catch (error) {
            console.log(error);
        }
    }

    const[{ isOver }, dropRef] = useDrop({
        accept: 'asset',
        drop: (item) => handleDrop(item),
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    });

    /**
     * @description Handles an item being dropped in this container
     * 
     * @param {*} item The item being dropped
     */
    const handleDrop = (item) => {
        let copyOfSlot = schedule[item.index];
        let crewList = copyOfSlot.crew;
        let updatedSchedule = [...schedule];

        if(item.type == 'crew') {

            let newCrew = crewList.filter((crew) => crew != item.crew);

            copyOfSlot = {
                jobid: copyOfSlot.jobid,
                crew: newCrew,
                trucks: copyOfSlot.trucks
            }
            
            updatedSchedule[item.index] = copyOfSlot;
            setSchedule(updatedSchedule);
            setCrew([...crews, item.crew]);
        } 
    }
    
    /**
     * @description Sets the crew member being edited and opens the edit crew modal
     * 
     * @param {*} crewMember The crew member to be edited
     */
    const openModal = (crewMember) => {
        setCrewMemberBeingEdited(crewMember);
        setCrewModal(true);
    }

    return(
        <>
            <div className="flex flex-col rounded-lg w-[25vh]" ref={dropRef}>
                <div className="bg-secondary-200 rounded-t-lg flex px-3 justify-between">
                    <h2 className="text-white text-xl text-center">Crew</h2>
                    <button className="text-white text-xl" onClick={() => setEditingCrew(!editingCrew)}><FontAwesomeIcon icon={faSliders} /></button>
                </div>
                <div className="flex flex-col rounded-b-lg h-[35vh] bg-grey-100 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-white gap-2 items-start px-2 ">
                        
                    {editingCrew ? 
                        (fullCrew.map((crew, index) => {
                            return (
                                <div className="flex items-center justify-between w-full bg-grey-200" key={index}>
                                    <h1 className="text-sm text-white font-bold">{crew.last_name + ", " + crew.first_name}</h1>
                                    <button onClick={() => openModal(crew)} className="bg-primary text-white border-blue-700 border-2 px-2 z-30">Edit</button>
                                </div>
                            )
                        }))
                    : 
                        (crews.map((crew, index) => (
                            <JobAsset key={index} name={crew.last_name + ", " + crew.first_name} type={'crew'} crew={crew} comingFromSlot={false} showDetail={true}/>
                        )))
                    }
                </div>


            </div>

            {crewmodal ? <EditCrewModel crewMember={crewMemberBeingEdited} onClose={setCrewModal} /> : null}
        </>
    )
}