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

export const CrewContainer = ({ crews, setCrew, date, schedule, setSchedule, setFullCrew, fullCrew }) => {
    const [editingCrew, setEditingCrew] = useState(false);
    const [crewmodal, setCrewModal] = useState(false);
    const [crewMemberBeingEdited, setCrewMemberBeingEdited] = useState({});

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
                                <div className="flex items-center justify-between w-full bg-grey-200">
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