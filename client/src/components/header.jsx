/**
 * @author Tyler Marois
 */
import React from "react";
import { Tab } from './tab';

/**
 * @description The navigator of the application allowing users to switch between pages
 * 
 * @param {*} user The users information
 * @param {*} updatePage The function used to change the state that controls which page is displayed
 * @returns A header with tabs/buttons to control the app
 */
export const Header = ({ user, updatePage, pageColors }) => {


    return (
        <div className="flex-col bg-primary">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl p-2 text-white">TrendSync</h1>
                <h1 className="text-xl p-2 text-white">Welcome, {user.first_name}</h1>
            </div>
            <div className="bg-grey-100 flex">
                <Tab title="Job Board" updatePage={() => updatePage(0)} color={pageColors[0]}/>
                <Tab title="Add Job" updatePage={() => updatePage(1)}/>
                <Tab title="Add User" updatePage={() => updatePage(2)}/>
                <Tab title="Add Truck" updatePage={() => updatePage(3)}/>
            </div>
        </div>
    )
}