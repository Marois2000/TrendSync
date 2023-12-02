/**
 * @author Tyler Marois
 */
import React from "react";

/**
 * @description A single customer component item in the customer search dropbox
 * 
 * @param {*} customer The selected customer
 * @param {*} setCustomer Sets the current customer
 * @param {*} changeSearch Sets the search to the selected customer to fill in search bar
 * @param {*} setSearching Sets the searching to close/open the dropbox 
 * 
 * @returns A card of a customers name
 */
export const CustomerItem = ({ customer, setCustomer, changeSearch, setSearching}) => {

    /**
     * @description Updates the customer, the search field, and the dropbox being open or not
     */
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