/**
 * @author Tyler Marois
 */
import React, { useState, useEffect } from "react";
import { Header } from "../components/header";
import { JobBoard } from "./jobboard";
import { AddJob } from "./addjob";
import { AddUser } from "./adduser";
import { AddTruck } from "./addtruck";
import { ViewCustomers } from "./viewcustomers";

/**
 * @description Renders out all the pages of the application
 * 
 * @param {*} user The users information 
 * @returns html of all the different pages and components
 */
export const Home = ({ user }) => {
    const [jobBoard, setJobBoard] = useState(true); // The job board page
    const [addJob, setAddJob] = useState(false); // The add job page
    const [addUser, setAddUser] = useState(false); // The add user page
    const [addTruck, setAddTruck] = useState(false); // The add truck page
    const [viewCustomers, setViewCustomers] = useState(false); // The view customers page
    const [pages, setPages] = useState([jobBoard, addJob, addUser, addTruck, viewCustomers]); // Keeps track of all the pages to know which is currently open

    /**
     * @description Switches the state of which page to display based off the index
     * 
     * @param index The page to go to
     */
    const updatePage = (index) => {
        switch(index) {
            case 0:
                setJobBoard(true);
                setAddJob(false);
                setAddUser(false);
                setAddTruck(false);
                setViewCustomers(false);
            break;

            case 1:
                setJobBoard(false);
                setAddJob(true);
                setAddUser(false);
                setAddTruck(false);
                setViewCustomers(false);
            break;

            case 2:
                setJobBoard(false);
                setAddJob(false);
                setAddUser(true);
                setAddTruck(false);
                setViewCustomers(false);
            break;

            case 3:
                setJobBoard(false);
                setAddJob(false);
                setAddUser(false);
                setAddTruck(true);
                setViewCustomers(false);
            break;

            case 4:
                setJobBoard(false);
                setAddJob(false);
                setAddUser(false);
                setAddTruck(false);
                setViewCustomers(true);
            break;
        }
    }

    /**
     * Update the pages state array based on the latest state values
     */
    useEffect(() => {
        setPages([jobBoard, addJob, addUser, addTruck, viewCustomers]);
    }, [jobBoard, addJob, addUser, addTruck, viewCustomers]);


    return (
        <div className="h-[100vh] flex-col justify-center items-start overflow-hidden">
            <Header updatePage={updatePage} user={user} pageColors={pages}/>
            {jobBoard ? <JobBoard /> : null}
            {addJob ? <AddJob /> : null}
            {addUser ? <AddUser /> : null}
            {addTruck ? <AddTruck /> : null}
            {viewCustomers ? <ViewCustomers /> : null}
        </div>
    )
}