/**
 * @author Tyler Marois
 */
import { StyledView, StyledText, StyledScroll, StyledOpacity } from '../StyleWrappers';
import { useEffect, useState } from 'react';
import path from "../path";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Jobcard from '../components/jobcard';
import Jobdetails from './jobdetails';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @description The Dashboard page
 * 
 * @param {*} user The current user logged in
 * @param {*} setUser Sets the current user logged in, for log out purposes
 * 
 * @returns The page where users see their job for the day
 */
export default Home = ({ user, setUser }) => {
    const today = new Date(); // Todays date
    const year = today.getFullYear(); // Current year
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Current month as 2 digits
    const day = String(today.getDate()).padStart(2, '0'); // Current day as 2 digits
    const stringDate = year + "-" + month + "-" + day; // Valid string of date

    const options = { month: 'long', day: 'numeric' }; // Options for formating
    
    const [date, setDate] = useState(today); // The date as a JS object
    const [dateForDB, setDateForDB] = useState(stringDate); // The date as a string for storing in the DB
    const [displayDate, setDisplayDate] = useState(today.toLocaleString('en-US', options)); // The date to be displayed

    const [jobs, setJobs] = useState([]); // The users jobs on a given date
    const [crew, setCrew] = useState([]); // crew on the jobs
    const [trucks, setTrucks] = useState([]); // The trucks on the jobs

    const [showJob, setShowJob] = useState(false); // Show a job or not
    const [job, setJob] = useState({}); // The current job to be opened
    const [customer, setCustomer] = useState({}); // The customer for the current job

    const [userOptions, setUserOptions] = useState(false); // Determines if user options are open or not

    useEffect(() => {
        setCrew([]);
        setTrucks([]);
        setJobs([]);
        getJobDetails();
    }, [dateForDB]);

    useEffect(() => {
        if(customer.first_name) {
            setShowJob(true);
        }
    }, [customer])

    /**
     * @description Get the details of a job from the API
     */
    const getJobDetails = async() => {
        const body = {
            userId: user.user_id,
            date: dateForDB
        }
        try {
            const req = await fetch(path+'/trendsync/getusersjob', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            const res = await req.json();
            const { jobid, crew, trucks } = res;


            if(res != undefined) {
                setCrew(crew);
                setTrucks(trucks);
                setJobs(jobid);
            } else {
                setCrew([]);
                setTrucks([]);
                setJobs([]);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * @description Increase the date by one day
     */
    const increaseDate = () => {
        const currentDate = date;
        currentDate.setDate(currentDate.getDate() + 1);
        setDate(currentDate);
        const formattedDate = formatDate(date);
        setDateForDB(formattedDate);
        setDisplayDate(date.toLocaleString('en-US', options));
    };

    /**
     * @description Decrease the date by one day
     */
    const decreaseDate = () => {
        const currentDate = date;
        currentDate.setDate(currentDate.getDate() - 1);
        setDate(currentDate);
        const formattedDate = formatDate(date);
        setDateForDB(formattedDate);
        setDisplayDate(date.toLocaleString('en-US', options));
    };

    /**
     * @description Format the date
     * 
     * @param {*} date the date to be formatted
     * @returns A formatted date string
     */
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    };
  
    /**
     * @description Opens the job working window
     * 
     * @param {*} jobTarget The job to open
     */
    const goToJobDetails = (jobTarget) => {
        setJob(jobTarget);
        getCustomer(jobTarget);
    }

    /**
     * @description Closes the job details page
     */
    const comeBackToDash = () => {
        setJob({});
        setCustomer({});
        setShowJob(false);
    }

    /**
     * @description Gets the customer of a job
     * 
     * @param {*} jobTarget The current job
     */
    const getCustomer = async(jobTarget) => {
        const body = {
            id: jobTarget.customer_id
        }

        try {
            const req = await fetch(path+"/trendsync/getcustomer", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const res = await req.json();
            
            setCustomer(res);
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * @description Logs the current user out
     */
    const logout = async () => {
        await AsyncStorage.removeItem('user');
        setUser({});
    }

    return (
        <StyledView classes={["flex:1", "justify:start", "items:center", "bg:background"]} >
            {showJob ?   <Jobdetails job={job} customer={customer} backToDash={comeBackToDash} user={user}/> :


                    <StyledView classes={["flex:1", "justify:start", "items:center", "bg:background", "w:full"]} >
                        <StyledView classes={["justify:center", "items:end", "bg:background", "w:full", "h:[10%]", "flex:row", "pb:2"]}>
                            <StyledView classes={["w:[33%]"]}><StyledText> </StyledText></StyledView>
                            <StyledText classes={["flex:1", "text-align:center", "text:lg"]}>Dashboard</StyledText>
                            <StyledView classes={["w:[33%]", "justify:end", "items:end"]}>
                                <MaterialCommunityIcons 
                                        name='dots-vertical' 
                                        size={32} 
                                        color="#1B3F9C"
                                        onPress={() => setUserOptions(!userOptions)}
                                /> 
                            
                            </StyledView>
                        </StyledView>

                        <StyledView classes={["justify:between", "items:center", "bg:primary", "w:full", "h:[20%]", "flex:row"]} onTouchEnd={() => setUserOptions(false)}>
                            <StyledView classes={["m:5"]}>
                                <MaterialCommunityIcons 
                                    name='chevron-left' 
                                    size={48} 
                                    color="#F5F5F5"
                                    onPress={decreaseDate} 
                                /> 
                            </StyledView>

                            <StyledView classes={["m:5"]}>
                                <StyledText classes={["color:background", "text:3xl"]}>{displayDate}</StyledText>
                            </StyledView>

                            <StyledView classes={["m:5"]}>
                                <MaterialCommunityIcons 
                                    name='chevron-right' 
                                    size={48} 
                                    color="#F5F5F5"
                                    onPress={increaseDate} 
                                /> 
                            </StyledView>
                        </StyledView>

                        <StyledScroll classes={["flex:1", "bg:background", "w:full"]} contentContainerStyle={{alignItems:'center'}} onTouchEnd={() => setUserOptions(false)}>
                            {Array.isArray(jobs) && jobs.length > 0 ? (jobs.map((job, index) => {
                                return(
                                    <Jobcard job={job} crew={crew} trucks={trucks} setJob={goToJobDetails} key={index}/>
                                );
                            }))
                            : <StyledText classes={["m:5", "text:4xl"]}>No Jobs Today</StyledText>}

                        </StyledScroll>
                        
                    </StyledView>

            }
            
            {userOptions ? 
                <StyledView classes={["absolute", "top:[10%]", "right:1", 'bg:background', "w:[30%]", "border:2", "border-color:primary2"]}>
                    <StyledOpacity classes={["my:2", "w:full", "items:center", "flex:row", "justify:around"]} onPress={logout}>
                        <StyledText classes={["text-align:right"]}>Logout</StyledText>
                        <MaterialIcons name="logout" size={24} color="black" />
                    </StyledOpacity>
                </StyledView>
            : null}
        </StyledView>
    )
}