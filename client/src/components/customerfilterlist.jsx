/**
 * @author Tyler Marois
 */
import React, { useState } from "react";
import { CustomerItem } from "./customeritem";

export const CustomerFilterList = ({ customers, customer, setCustomer}) => {
    const [search, setSearch] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState(customers);
    const [searching, setSearching] = useState(false);
    

    const filterList = () => {
        setFilteredCustomers(customers.filter(customer => customer.first_name.toLowerCase().includes(search.toLowerCase()) || customer.last_name.toLowerCase().includes(search.toLowerCase())));
    }

    return (
        <div>
            <div className="flex items-center">
                <input type="text" placeholder="Search.." onKeyUp={filterList} value={search} onChange={e => setSearch(e.target.value)} />
                <button className="w-[3vh]" onClick={(e) => setSearching(!searching)}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform={searching ? "rotate(90)" : "rotate(0)"}><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z" fill="#F4872C"></path> </g></svg>
                </button>
            </div>
            <div style={searching ? {display: "flex", flexDirection: "column"} : {display: "none"}} className="h-[15vh] overflow-y-auto border-2 border-primary absolute bg-background">
                {filteredCustomers.map((customer) => {
                    return(
                        <CustomerItem changeSearch={setSearch} setCustomer={setCustomer} customer={customer}/>
                    )
                })}
            </div>
        </div>
    )
}