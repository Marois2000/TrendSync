/**
 * @author Tyler Marois
 */
import { React, useState } from "react";
import { InputField } from "../components/inputfield";
import { CustomerFilterList } from "../components/customerfilterlist";
import { MyButton } from "../components/mybutton";

/**
 * @description The add job page where you can create a job
 * 
 * @returns The add job form for adding jobs into the database and an add customer modal for adding customers
 */
export const AddJob = () => {
    const [customer, setCustomer] = useState({});

    /**
     * @description Gets passed into the customer selection to select a customer
     * 
     * @param {*} custom The customer for the state to be set to
     */
    const update = (custom) => {
        setCustomer(custom);
    }

    const customers = [
        { first_name: "John", last_name: "Doe" },
        { first_name: "Alice", last_name: "Smith" },
        { first_name: "Bob", last_name: "Johnson" },
        { first_name: "Eve", last_name: "Brown" },
        { first_name: "Charlie", last_name: "Williams" },
        { first_name: "Sarah", last_name: "Davis" },
        { first_name: "David", last_name: "Lee" },
        { first_name: "Olivia", last_name: "Clark" },
        { first_name: "James", last_name: "Wilson" },
        { first_name: "Emma", last_name: "Moore" },
        { first_name: "Michael", last_name: "Martinez" },
        { first_name: "Sophia", last_name: "Hernandez" },
        { first_name: "Matthew", last_name: "Lopez" },
        { first_name: "Emily", last_name: "Garcia" },
        { first_name: "William", last_name: "Perez" },
        { first_name: "Mia", last_name: "Sanchez" },
        { first_name: "Daniel", last_name: "Adams" },
        { first_name: "Ava", last_name: "Turner" },
        { first_name: "Joseph", last_name: "Torres" },
        { first_name: "Samantha", last_name: "Parker" }
      ];
      

    return (
        <div className="flex flex-col items-center justify-evenly space-y-1 bg-background">
            <div className="z-40 w-[80vw] flex items-center justify-between border-b-2 border-primary mx-9 mt-3">
                <CustomerFilterList customers={customers} customer={customer} setCustomer={update}/>
                <MyButton text="Add Customer"/>
            </div>
            <div className="flex gap-10 justify-center items-center w-[80vw]">
                <InputField title="Pickup Address" placeholder="123 Main St, City, State, Zip"/>
                <InputField title="Dropoff Address" placeholder="123 Main St, City, State, Zip"/>
            </div>
            <div className="flex gap-10 justify-center items-center w-[80vw]">
                <InputField title="Number of Trucks" number={true} placeholder="Enter Number of Trucks"/>
                <InputField title="Number of Crew" number={true} placeholder="Enter Number of Crew"/>
            </div>
            <div className="flex gap-10 justify-center items-center w-[80vw]">
                <InputField title="Date" date={true}/>
                <InputField title="Rate" number={true} placeholder="Enter the Rate"/>
                <InputField title="Estimate" number={true} placeholder="Enter the Estimated Time"/>
            </div>
            <div className="flex gap-10 justify-center items-center w-[80vw]">
                <div className="w-full">
                    <h2 className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Notes</h2>
                    <textarea type="text"
                        className="drop-shadow h-[20vh] appearance-none block w-full bg-gray-200 text-gray-700 border border-primary rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    />
                </div>
            </div>
            <div className="pb-10">
                <MyButton text="Add Job"/>

            </div>
        </div>
    )
}