/**
 * @author Tyler Marois
 */
import React from "react";

/**
 * @description Input text field component
 * 
 * 
 * @param {*} title Text to be displayed above input
 * @param {*} value The data of the field stored as state
 * @param {*} placeholder Default placeholder text
 * @param {*} onChange Updates the state of the field
 * @param {*} hidden If true block text, otherwise show text
 * @param {*} number Changes the field to a number input
 * @param {*} date Changes the field to be a date input
 * @returns An input field with the selected input
 */
export const InputField = ({title, value, placeholder, onChange, hidden, number, date }) => {
    return(
        <div className="w-full">
            <h2 className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{title}</h2>
            <input type={hidden ? "password" : number ? "number" : date ? "date" : "text"}
                className="drop-shadow appearance-none block w-full bg-gray-200 text-gray-700 border border-primary rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                placeholder={placeholder}
                value={value} 
                onChange={onChange}/>
        </div>
    )
}