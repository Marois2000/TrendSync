/**
 * @author Tyler Marois
 */
import React, { useEffect } from "react";
import { InputField } from "./inputfield";
import { TimeSlot } from "./timeslot";
import { path } from "../path";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Schedule = ({ date, setDate, schedule, setSchedule}) => {

    useEffect(() => {
        getSchedule();
    }, [date]);

    useEffect(() => {
    }, [schedule]);

    const getSchedule = async() => {
        const body = {
            date: date
        }
        try {
            const req = await fetch(path+"/trendsync/getschedule", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            const res = await req.json();

            if(res.length == 0) {
                const initReq = await fetch(path+"/trendsync/initschedule", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                });
                const newSchedule = await initReq.json();

                setSchedule(newSchedule[0].schedule.timeslots);
            } else {
                setSchedule(res[0].schedule.timeslots);
            }
            
        } catch (error) {
            console.log(error.message);
        }
    }

    const addTimeSlot = () => {
        const copySchedule = [...schedule, {
            jobid: [],
            crew: [],
            trucks: []
        }];
        setSchedule(copySchedule);
    }

    const updateSchedule = async e => {
        const scheduleInput = {
            timeslots: schedule
        }

        const body = {
            date: date,
            schedule: scheduleInput
        }
        try {
            const req = await fetch(path+"/trendsync/updateschedule", {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const res = await req.json();

            setSchedule(res.schedule.timeslots);
            toast.success('Schedule Saved!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center m-5">
            <div className="flex justify-end items-center w-full">
                <div className="flex gap-5">
                    <InputField date={true} value={date} onChange={(e) => setDate(e.target.value)}/>
                    <div className="flex justify-center items-center">
                        <button onClick={(e) => updateSchedule(e)} className="p-1 rounded-md px-2 bg-green-500 border-green-900 border-2 text-white text-xl">Save</button>
                    </div>
                    <div className="w-[10%] flex justify-center items-center cursor-pointer" onClick={addTimeSlot}>
                        <svg className="w-full"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44771 13 8V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H13V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V13H8C7.44772 13 7 12.5523 7 12C7 11.4477 7.44771 11 8 11H11V8Z" fill="#1B3F9C"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M23 4C23 2.34315 21.6569 1 20 1H4C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4ZM21 4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4Z" fill='#F4872C'></path> </g></svg>
                    </div>
                </div>
            </div>
            <div className="bg-secondary-200 flex justify-center items-center w-full rounded-t-lg">
                <h1 className="text-white text-xl">Schedule</h1>
            </div>
            <div className="flex flex-col rounded-b-lg h-[50vh] bg-grey-100 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-primary scrollbar-track-white gap-2 items-center w-full">
                {schedule.map((timeslot, index) => {
                    return (
                        <TimeSlot index={index} crew={timeslot.crew} trucks={timeslot.trucks} jobs={timeslot.jobid} schedule={schedule} setSchedule={setSchedule} />
                    )
                })}
            </div>
            <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
        </div>
    )
}