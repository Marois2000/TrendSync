/**
 * @author Tyler Marois
 */
import React from "react";

/**
 * @description allows user to click and switch which page they are viewing
 * 
 * @param {*} updatePage changes the state for which page to render, function found in home.jsx
 * @param {*} title What text to display 
 * @returns A button with the title and an onclick for the updatePage
 */
export const Tab = ({ updatePage, title }) => {
    return (
        <button
            className="bg-grey-200 text-white text-xl mt-1 ml-1 py-1 px-3 rounded-t-lg  focus:bg-primary"
            onClick={updatePage}>
                {title}
        </button>
    )
}