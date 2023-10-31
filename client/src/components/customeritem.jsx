/**
 * @author Tyler Marois
 */
import React from "react";

export const CustomerItem = ({ customer, setCustomer, changeSearch, setSearching}) => {

    const update = () => {
        setCustomer(customer);
        changeSearch(`${customer.last_name}, ${customer.first_name}`);
        setSearching(false);
    }

    return(
        <div onClick={() => update()} className="bg-grey-200 flex justify-center items-center mt-1 border-t-2 cursor-pointer">
            <h2 className="text-white">{customer.last_name}, {customer.first_name}</h2>
        </div>
    )
}