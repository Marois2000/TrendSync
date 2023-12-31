/**
 * @author Tyler Marois
 */
import React, { useState, useEffect } from "react";
import { CustomerItem } from "./customeritem";

/**
 * @description The customer search box, a dropdown of all the customers
 * 
 * @param {*} customer The current customer
 * @param {*} customers List of all the customers
 * @param {*} setCustomer Sets the current customer
 * 
 * @returns A list of customers that can be filtered
 */
export const CustomerFilterList = ({ customers, customer, setCustomer}) => {
    const [search, setSearch] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState(customers);
    const [searching, setSearching] = useState(false);
    
    useEffect(() => {
        filterList();
    }, [customers]);

    useEffect(() => {
        if(customer && customer.last_name && customer.first_name) {
            setSearch(customer.last_name + ", " + customer.first_name);
            filterList();
        }
    }, [customer]);

    /**
     * @description Filters all the customers in the dropdown box
     */
    const filterList = () => {
        setFilteredCustomers(customers.filter(customer => customer.first_name.toLowerCase().includes(search.toLowerCase()) || customer.last_name.toLowerCase().includes(search.toLowerCase())));
    }

    return (
        <div>
            <div className="flex items-center pb-3">
                <div className="flex flex-col">
                    <h2 className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Customer</h2>
                    <div className="flex">
                        <input className="drop-shadow appearance-none block w-full bg-gray-200 text-gray-700 border border-primary rounded py-1  leading-tight focus:outline-none focus:bg-white"
                        type="text" placeholder="Search.." onKeyUp={filterList} value={search} onChange={e => setSearch(e.target.value)} />
                        <button className="w-[3vh] border-0 border-primary focus:border-transparent" onClick={(e) => setSearching(!searching)}>
                            <svg className="transition-all duration-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform={searching ? "rotate(90)" : "rotate(0)"}><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z" fill="#F4872C"></path> </g></svg>
                        </button>
                    </div>
                </div>
                
            </div>
            <div style={searching ? {opacity: 1, height: "15vh"} : {opacity: 0, height: 0}} className="scrollbar-thin scrollbar-thumb-primary overflow-y-auto border-2 transition-all duration-300 border-primary absolute bg-background rounded-b-lg">
                {filteredCustomers.map((customer, index) => {
                    return(
                        <CustomerItem key={index} setSearching={setSearching} changeSearch={setSearch} setCustomer={setCustomer} customer={customer}/>
                    )
                })}
            </div>
        </div>
    )
}