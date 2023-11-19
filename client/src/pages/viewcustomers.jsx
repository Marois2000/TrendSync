/**
 * @author Tyler Marois
 */
import React, { useEffect, useState } from "react";
import { path } from "../path";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faCircle } from '@fortawesome/free-solid-svg-icons';
import { MakePayment } from "../components/makepayment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EditCustomer } from "../components/editcustomer";

export const ViewCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [az, setAZ] = useState(true);
    const [leastToGreat, setLeastToGreat] = useState(true);
    const [sortAlphabetically, setSortAlphabetically] = useState();
    const [makingPayment, setMakingPayment] = useState(false);
    const [editing, setEditing] = useState(false);
    const [focusCustomer, setFocusCustomer] = useState({});

    useEffect(() => {
        getCustomers();
    }, []);

    useEffect(() => {
        filterList();
    }, [customers]);

    useEffect(() => {
        getCustomers();
    }, [makingPayment, editing])

    const getCustomers = async() => {
        try {
            const req = await fetch(path + "/trendsync/customers", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            const res = await req.json();
            setCustomers(res);
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * @description Filters all the customers in the dropdown box
     */
    const filterList = () => {
        setFilteredCustomers(customers.filter(customer => customer.first_name.toLowerCase().includes(search.toLowerCase()) || customer.last_name.toLowerCase().includes(search.toLowerCase())));
    }

    const sortList = (sortingBy) => {
        switch (sortingBy) {
            case 0:
                setSortAlphabetically(true);
                setAZ(!az);
                if(az) {
                    const sortedList = filteredCustomers.sort((a, b) => (a.last_name + a.first_name).localeCompare(b.last_name + b.first_name)); 
                    setFilteredCustomers(sortedList);
                } else {
                    const sortedList = filteredCustomers.sort((a, b) => (b.last_name + b.first_name).localeCompare(a.last_name + a.first_name)); 
                    setFilteredCustomers(sortedList);
                }
            break;

            case 1:
                setSortAlphabetically(false);
                setLeastToGreat(!leastToGreat);
                if(leastToGreat) {
                    const sortedList = filteredCustomers.sort((a, b) => a.balance - b.balance); 
                    setFilteredCustomers(sortedList);
                } else {
                    const sortedList = filteredCustomers.sort((a, b) => b.balance - a.balance); 
                    setFilteredCustomers(sortedList);
                }
            break;
        
            default:
                break;
        }
    }

    const openModal = (customer, edit) => {
        setFocusCustomer(customer)
        if(edit) {
            setEditing(true);
        } else {
            setMakingPayment(true);
        }
    }

    return(
        <>
            <div className="flex w-full justify-center items-start overflow-auto h-[100%] scrollbar-thin scrollbar-thumb-primary scrollbar-track-white">
                <div className="w-[80%] mt-20 mb-[15vh]">

                    <div className="flex flex-col w-[50%] mb-10">
                        <div className="flex">
                            <input className="drop-shadow appearance-none block w-full bg-gray-200 text-gray-700 border border-primary rounded py-2  leading-tight focus:outline-none focus:bg-white"
                            type="text" placeholder="Search.." onKeyUp={filterList} value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>


                    <table className="w-full text-center overflow-auto table-fixed">
                        <thead className="border-b-2 text-center text-lg sticky top-0 bg-background">
                            <tr>
                                <th><button onClick={() => sortList(0)}>Customer Name</button> <FontAwesomeIcon icon={sortAlphabetically ? (az ? faChevronUp : faChevronDown) : faCircle} /> </th>
                                <th><button onClick={() => sortList(1)}>Balance</button> <FontAwesomeIcon icon={sortAlphabetically == false ? (leastToGreat ? faChevronDown : faChevronUp) : faCircle} /> </th>
                                <th>Make Payment</th>
                                <th>Edit Customer</th>
                            </tr>
                        </thead>
                        <tbody >
                                {filteredCustomers.map((customer, index) => {
                                    return(
                                        <tr className="border-b-2">
                                            <td className="py-8 text-lg">{customer.first_name.replace(/^\w/, c => c.toUpperCase()) + " " + customer.last_name.replace(/^\w/, c => c.toUpperCase())}</td>
                                            <td>{new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }).format(customer.balance)}
                                            </td>
                                            <td><button onClick={() => {openModal(customer, false)}} className="bg-secondary-200 px-2 py-1 border-2 border-secondary-300 text-white" >Make Payment</button></td>
                                            <td><button onClick={() => {openModal(customer, true)}} className="bg-blue-500 px-2 py-1 border-2 border-primary text-white" >Edit</button></td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                </div>
            </div>

            {makingPayment ? <MakePayment customer={focusCustomer} onClose={setMakingPayment} toast={toast} /> : null}
            {editing ? <EditCustomer customer={focusCustomer} onClose={setEditing} toast={toast} /> : null}

            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick                    
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    )
}