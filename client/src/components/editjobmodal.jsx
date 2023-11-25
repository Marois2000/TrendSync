/**
 * @author Tyler Marois
 */
import React, { useState} from "react"
import { InputField } from "../components/inputfield";
import { MyButton } from "../components/mybutton";
import { path } from "../path";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

/**
 * @description A pop up menu to let users edit a job
 * 
 * @param {*} job The job being edited
 * @param {*} onClose Closes the job modal
 * 
 * @returns A pop up job edit menu
 */
export const EditJobModal = ({ job, onClose }) => {
    const [pickup, setPickup] = useState(job.pickup); // The jobs pickup address
    const [dropoff, setDropoff] = useState(job.dropoff); // The jobs dropoff address
    const [crew, setCrew] = useState(job.num_crew); // The jobs number of crew
    const [trucks, setTrucks] = useState(job.num_trucks); // The jobs number of trucks
    const [date, setDate] = useState(job.job_date.split('T')[0]); // The jobs date
    const [notes, setNotes] = useState(job.notes); // The jobs notes
    const [estimate, setEstimate] = useState(job.estimate); // The jobs estimate/minimum
    const [rate, setRate] = useState(job.rate); // The jobs rate

    /**
     * @description Calls the API and updates the given job
     */
    const updateJob = async() => {
        const body = {
            pickup: pickup,
            dropoff: dropoff,
            crew: crew,
            trucks: trucks,
            date: date,
            notes: notes,
            estimate: estimate,
            rate: rate,
            id: job.job_id
        }
        
        try {
            const req = await fetch(path + "/trendsync/updatejob", {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            const res = await req.json();

            location.reload();
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * @description Calls the API and deletes the given job
     */
    const deleteJob = async() => {
        const body = {
            id: job.job_id
        }
        try {
            const req = await fetch(path + "/trendsync/deletejob", {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            const res = await req.json()
            location.reload();
        } catch (error) {
            console.log(error.message);
        }
    }
    
    return (
        <div className="fixed top-0 left-[0%] w-full h-full z-50 bg-opacity-30 bg-black justify-center items-center flex">
            <div className="bg-background w-[70%] rounded-lg overflow-hidden">
                <div className="w-full bg-primary justify-between items-center flex mb-5">
                    <h1 className="text-white text-3xl p-2">Edit Job</h1>
                    <button className="text-white p-3 text-3xl" onClick={() => onClose(false)}><FontAwesomeIcon icon={faTimes} /></button>
                </div>

                <div className="flex gap-10 justify-center items-center px-5">
                    <InputField title="Pickup Address" placeholder="123 Main St, City, State, Zip" value={pickup} onChange={(e) => setPickup(e.target.value)}/>
                    <InputField title="Dropoff Address" placeholder="123 Main St, City, State, Zip" value={dropoff} onChange={(e) => setDropoff(e.target.value)}/>
                </div>
                <div className="flex gap-10 justify-center items-center px-5">
                    <InputField title="Number of Trucks" number={true} placeholder="Enter Number of Trucks" value={trucks} onChange={(e) => setTrucks(e.target.value)}/>
                    <InputField title="Number of Crew" number={true} placeholder="Enter Number of Crew" value={crew} onChange={(e) => setCrew(e.target.value)}/>
                </div>
                <div className="flex gap-10 justify-center items-center px-5">
                    <InputField title="Date" date={true} value={date} onChange={(e) => setDate(e.target.value)}/>
                    <InputField title="Rate" number={true} placeholder="Enter the Rate" value={rate} onChange={(e) => setRate(e.target.value)}/>
                    <InputField title="Estimate" number={true} placeholder="Enter the Estimated Time" value={estimate} onChange={(e) => setEstimate(e.target.value)}/>
                </div>
                <div className="flex gap-10 justify-center items-center px-5">
                    <div className="w-full">
                        <h2 className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Notes</h2>
                        <textarea type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
                            className="drop-shadow h-[20vh] appearance-none block w-full bg-gray-200 text-gray-700 border border-primary rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        />
                    </div>
                </div>

               

                <div className="flex justify-between w-full my-5 px-5">
                    <MyButton text="Update" update={updateJob}/>
                    <button onClick={deleteJob} className="bg-red-600 px-3 text-lg text-white border-2 border-red-800 rounded-lg">Delete</button>
                </div>

            </div>
        </div>
    )
}