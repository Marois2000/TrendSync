/**
 * @author Tyler Marois
 */
import { StyledView, StyledText, StyledScroll } from '../StyleWrappers';
import Inputfield from '../components/inputfield';
import Button from '../components/button';
import { useEffect, useState } from 'react';
import path from "../path";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Jobcard from '../components/jobcard';


export default Home = ({ user }) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const stringDate = year + "-" + month + "-" + day;

    const options = { month: 'long', day: 'numeric' };
    

    const [date, setDate] = useState(today);
    const [dateForDB, setDateForDB] = useState(stringDate);
    const [displayDate, setDisplayDate] = useState(today.toLocaleString('en-US', options));

    const [jobs, setJobs] = useState([]);
    const [crew, setCrew] = useState([]);
    const [trucks, setTrucks] = useState([]);

    useEffect(() => {
        setCrew([]);
        setTrucks([]);
        setJobs([]);
        getJobDetails();
    }, [dateForDB]);

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


    const increaseDate = () => {
        const currentDate = date;
        currentDate.setDate(currentDate.getDate() + 1);
        setDate(currentDate);
        const formattedDate = formatDate(date);
        setDateForDB(formattedDate);
        setDisplayDate(date.toLocaleString('en-US', options));
    };

    const decreaseDate = () => {
        const currentDate = date;
        currentDate.setDate(currentDate.getDate() - 1);
        setDate(currentDate);
        const formattedDate = formatDate(date);
        setDateForDB(formattedDate);
        setDisplayDate(date.toLocaleString('en-US', options));
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
      };
  

    return (
        <StyledView classes={["flex:1", "justify:start", "items:center", "bg:background"]}>
            <StyledView classes={["justify:center", "items:end", "bg:background", "w:full", "h:[10%]", "flex:row", "pb:2"]}>
                <StyledView classes={["w:[33%]"]}><StyledText> </StyledText></StyledView>
                <StyledText classes={["flex:1", "text-align:center", "text:lg"]}>Dashboard</StyledText>
                <StyledView classes={["w:[33%]", "justify:end", "items:end"]}>
                    <MaterialCommunityIcons 
                            name='dots-vertical' 
                            size={32} 
                            color="#1B3F9C"
                            onPress={() => console.log("Add Functionality")}
                    /> 
                </StyledView>
                

            </StyledView>
            <StyledView classes={["justify:between", "items:center", "bg:primary", "w:full", "h:[20%]", "flex:row"]}>
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

            <StyledScroll classes={["flex:1", "bg:background", "w:full"]} contentContainerStyle={{alignItems:'center'}}>
                {Array.isArray(jobs) && jobs.length > 0 ? (jobs.map((job) => {
                    return(
                        <Jobcard job={job} crew={crew} trucks={trucks}/>
                    );
                }))
                : <StyledText classes={["m:5", "text:4xl"]}>No Jobs Today</StyledText>}
                


            </StyledScroll>
        </StyledView>
    )
}