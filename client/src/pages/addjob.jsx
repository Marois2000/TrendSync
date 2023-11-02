/**
 * @author Tyler Marois
 */
import { React, useState, useEffect } from "react";
import { InputField } from "../components/inputfield";
import { CustomerFilterList } from "../components/customerfilterlist";
import { MyButton } from "../components/mybutton";
import { path } from "../path";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddCustomerModal } from "../components/addcustomermodal";

/**
 * @description The add job page where you can create a job
 * 
 * @returns The add job form for adding jobs into the database and an add customer modal for adding customers
 */
export const AddJob = () => {
    const [customer, setCustomer] = useState({});
    const [customers, setCustomers] = useState([]);

    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [crew, setCrew] = useState(0);
    const [trucks, setTrucks] = useState(0);
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");
    const [estimate, setEstimate] = useState(0);
    const [rate, setRate] = useState(0);

    const [modalOpen, setModalOpen] = useState(false);


    /**
     * Updates the customers when it mounts, and whenever customers changes
     */
    useEffect(() => {
        if(customers.length == 0) {
            getCustomers();
        }
    }, [customers]);

    /**
     * @description Calls the API to get all the customers in the database
     */
    const getCustomers = async () => {
        try {
            const req = await fetch(path+"/trendsync/customers", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            const res = await req.json();

            setCustomers(res);
            
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * @description Gets passed into the customer selection to select a customer
     * 
     * @param {*} custom The customer for the state to be set to
     */
    const update = (custom) => {
        setCustomer(custom);
    }

    /**
     * @description Adds a job to the database if the form is complete
     */
    const addJobToDatabase = async e => {
        e.preventDefault();

        const body =  {
            customerId: customer.customer_id,
            pickup: pickup,
            dropoff: dropoff,
            crew: crew,
            trucks: trucks,
            date: date,
            notes: notes,
            estimate: estimate,
            rate: rate
        }

        try {
            const req = await fetch(path+"/trendsync/addjob", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            const res = await req.json();
            if(req.ok) {
                toast.success('Job Added!', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                toast.error('Error adding job', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
            
        } catch (error) {
            console.log(error.message);
        }
    }

      

    return (
        <div className="flex flex-col items-center justify-evenly space-y-1 bg-background">
            <div className="z-40 w-[80vw] flex items-center justify-between border-b-2 border-primary mx-9 mt-3">
                <CustomerFilterList customers={customers} customer={customer} setCustomer={update}/>
                <MyButton text="Add Customer" update={(e) => setModalOpen(!modalOpen)}/>
            </div>
            <div className="flex gap-10 justify-center items-center w-[80vw]">
                <InputField title="Pickup Address" placeholder="123 Main St, City, State, Zip" value={pickup} onChange={(e) => setPickup(e.target.value)}/>
                <InputField title="Dropoff Address" placeholder="123 Main St, City, State, Zip" value={dropoff} onChange={(e) => setDropoff(e.target.value)}/>
            </div>
            <div className="flex gap-10 justify-center items-center w-[80vw]">
                <InputField title="Number of Trucks" number={true} placeholder="Enter Number of Trucks" value={trucks} onChange={(e) => setTrucks(e.target.value)}/>
                <InputField title="Number of Crew" number={true} placeholder="Enter Number of Crew" value={crew} onChange={(e) => setCrew(e.target.value)}/>
            </div>
            <div className="flex gap-10 justify-center items-center w-[80vw]">
                <InputField title="Date" date={true} value={date} onChange={(e) => setDate(e.target.value)}/>
                <InputField title="Rate" number={true} placeholder="Enter the Rate" value={rate} onChange={(e) => setRate(e.target.value)}/>
                <InputField title="Estimate" number={true} placeholder="Enter the Estimated Time" value={estimate} onChange={(e) => setEstimate(e.target.value)}/>
            </div>
            <div className="flex gap-10 justify-center items-center w-[80vw]">
                <div className="w-full">
                    <h2 className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Notes</h2>
                    <textarea type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
                        className="drop-shadow h-[20vh] appearance-none block w-full bg-gray-200 text-gray-700 border border-primary rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    />
                </div>
            </div>
            <div className="pb-10">
                <MyButton text="Add Job" update={addJobToDatabase}/>
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
            <AddCustomerModal isOpen={modalOpen} onClose={(e) => setModalOpen(!modalOpen)} setCustomer={setCustomer} updateCustomers={getCustomers}/>
        </div>
    )
}