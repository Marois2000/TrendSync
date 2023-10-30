/**
 * @author Tyler Marois
 */
import React, { useState } from "react";
import { Header } from "../components/header";
import { JobBoard } from "./jobboard";
import { AddJob } from "./addjob";

/**
 * @description Renders out all the pages of the application
 * 
 * @param {*} user The users information 
 * @returns html of all the different pages and components
 */
export const Home = ({ user }) => {
    const [jobBoard, setJobBoard] = useState(true);
    const [addJob, setAddJob] = useState(false);
    const [addUser, setAddUser] = useState(false);
    const [addTruck, setAddTruck] = useState(false);

    /**
     * @description Switches the state of which page to display based off the index
     * 
     * @param index The page to go to
     */
    const updatePage = (index) => {
        console.log(index);
        switch(index) {
            case 0:
                setJobBoard(true);
                setAddJob(false);
                setAddUser(false);
                setAddTruck(false);
            break;

            case 1:
                setJobBoard(false);
                setAddJob(true);
                setAddUser(false);
                setAddTruck(false);
            break;

            case 2:
                setJobBoard(false);
                setAddJob(false);
                setAddUser(true);
                setAddTruck(false);
            break;

            case 3:
                setJobBoard(false);
                setAddJob(false);
                setAddUser(false);
                setAddTruck(true);
            break;
        }
    }


    return (
        <div className="h-[100vh] flex-col justify-center items-start">
            <Header updatePage={updatePage} user={user}/>
            {jobBoard ? <JobBoard /> : null}
            {addJob ? <AddJob /> : null}
            {addUser ? <h1>Add User</h1> : null}
            {addTruck ? <h1>Add Truck</h1> : null}

        </div>
    )
}