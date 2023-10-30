/**
 * @author Tyler Marois
 */
import { React, useState } from "react";
import { InputField } from "../components/inputfield";
import { CustomerFilterList } from "../components/customerfilterlist";
import { MyButton } from "../components/mybutton";

export const AddJob = () => {
    const [customer, setCustomer] = useState({});

    const update = (custom) => {
        console.log(custom.first_name);
        setCustomer(custom)
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
        <div className="flex flex-col justify-evenly space-y-10">
            <div className="p-3 flex items-center justify-between border-b-2 border-primary mx-9 mt-9">
                <CustomerFilterList customers={customers} customer={customer} setCustomer={update}/>
                <MyButton text="Add Customer"/>
            </div>
            <div>
                <h1>rgqerg</h1>
            </div>
        </div>
    )
}