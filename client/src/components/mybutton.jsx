/**
 * @author Tyler Marois
 */
import React from "react";

/**
 * @description A component for a button in the trendsync application
 * 
 * @param {*} update The function to be called on button press passed from parent 
 * @param {*} text Text to be displayed for the button
 * @returns 
 */
export const MyButton = ({ update, text}) => {
    return (
        <div className="w-full flex items-center justify-center">
            <button
            className="bg-secondary-200 text-white mt-7 text-3xl p-3 rounded-lg border-2 border-secondary-300 drop-shadow-xl focus:bg-secondary-100"
            onClick={update}>
                {text}
            </button>
        </div>
    )
}