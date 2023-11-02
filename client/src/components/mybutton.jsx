/**
 * @author Tyler Marois
 */
import React from "react";

/**
 * @description A component for a button in the trendsync application
 * 
 * @param {*} update The function to be called on button press passed from parent 
 * @param {*} text Text to be displayed for the button
 * @returns A button to trigger a function
 */
export const MyButton = ({ update, text}) => {
    return (
        <div className="flex items-center justify-center">
            <button
            className="bg-secondary-200 text-white text-xl py-1 px-3 rounded-lg border-2 border-secondary-300 drop-shadow-xl focus:bg-secondary-100"
            onClick={update}>
                {text}
            </button>
        </div>
    )
}