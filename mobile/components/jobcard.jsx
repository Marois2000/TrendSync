/**
 * @author Tyler Marois
 */
import { StyledView, StyledText, StyledOpacity } from '../StyleWrappers';
import { useEffect, useState } from 'react';
import path from "../path";

/**
 * @description A card showing job and a few details
 * 
 * @param {*} job The data about the job
 * @param {*} crew The crew on the job
 * @param {*} trucks The trucks on the job
 * @param {*} setJob Sets the job for the parents state
 * 
 * @returns A job card with some details
 */
export default JobCard = ({ job, crew, trucks, setJob}) => {
    const [title, setTitle] = useState(""); // The jobs title/customer name

    useEffect(() => {
        getTitle();
    }, []);

    /**
     * @description Gets the jobs title based off the customer ID from the API
     */
    const getTitle = async() => {
        const body = {
            id: job.customer_id
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
            
            const string = res.first_name + " " + res.last_name;
            setTitle(string);
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <StyledOpacity onPress={() => setJob(job)} classes={["justify:center", "items:center", "w:[80%]", "rounded:lg", "my:2", "shadow:xl"]}>
            <StyledView classes={["w:full", "bg:secondary2", "rounded-t:lg", "flex:row", "justify:between", "items:center"]}>
                <StyledText classes={["text:xl", "color:background", "p:2"]}>{title}</StyledText>
                {job.complete ? <StyledText classes={["px:3", "color:background", "text:lg"]}>Completed</StyledText> : null}
            </StyledView>

            <StyledView classes={["w:full", "bg:grey1", "border-b:1"]}>
                <StyledText classes={["w:[60%]", "text:sm", "my:3", "pl:1"]}>{job.pickup}</StyledText>
                <StyledText classes={["w:[60%]", "text:sm", "my:3", "pl:1"]}>{job.dropoff}</StyledText>
            </StyledView>
            <StyledView classes={["bg:grey1", "w:full", "flex:wrap", "flex:row", "p:1", "pb:4"]} style={{gap: 5}}>
                {Array.isArray(crew) ? (crew.map((crewMember, index) => {
                    return(
                        <StyledView classes={["rounded:xl", "bg:grey2", "p:1"]} key={index}>
                            <StyledText classes={["text:xs"]}>{crewMember.first_name + " " + crewMember.last_name}</StyledText>
                        </StyledView>
                    );
                })) : <StyledText>No Crew</StyledText>}
            </StyledView>
            <StyledView classes={["bg:grey1", "w:full", "flex:wrap", "flex:row", "p:1"]} style={{gap: 5}}>
                {Array.isArray(trucks) ? (trucks.map((truck, index) => {
                    return(
                        <StyledView classes={["rounded:xl", "bg:grey2", "p:1"]} key={index}>
                            <StyledText classes={["text:xs"]}>{truck.name}</StyledText>
                        </StyledView>
                    );
                })) : <StyledText>No Truck</StyledText>}
            </StyledView>
        </StyledOpacity >
    )
}