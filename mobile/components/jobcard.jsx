/**
 * @author Tyler Marois
 */
import { StyledView, StyledText, StyledOpacity } from '../StyleWrappers';
import Inputfield from '../components/inputfield';
import Button from '../components/button';
import { useEffect, useState } from 'react';
import path from "../path";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default JobCard = ({ job, crew, trucks, setJob}) => {
    const [title, setTitle] = useState("");

    useEffect(() => {
        getTitle();
    }, []);

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
        <StyledOpacity onPress={() => setJob(job)} classes={["justify:center", "items:center", "w:[70%]", "rounded:lg", "my:2", "shadow:xl"]}>
            <StyledView classes={["w:full", "bg:secondary2", "rounded-t:lg"]}>
                <StyledText classes={["text:xl", "color:background", "p:2"]}>{title}</StyledText>
            </StyledView>

            <StyledView classes={["w:full", "bg:grey1", "border-b:1"]}>
                <StyledText classes={["w:[60%]", "text:sm", "my:3", "pl:1"]}>{job.pickup}</StyledText>
                <StyledText classes={["w:[60%]", "text:sm", "my:3", "pl:1"]}>{job.dropoff}</StyledText>
            </StyledView>
            <StyledView classes={["bg:grey1", "w:full", "flex:wrap", "flex:row", "p:1", "pb:4"]} style={{gap: 5}}>
                {Array.isArray(crew) ? (crew.map((crewMember) => {
                    return(
                        <StyledView classes={["rounded:xl", "bg:grey2", "p:1"]}>
                            <StyledText classes={["text:xs"]}>{crewMember.first_name + " " + crewMember.last_name}</StyledText>
                        </StyledView>
                    );
                })) : <StyledText>No Crew</StyledText>}
            </StyledView>
            <StyledView classes={["bg:grey1", "w:full", "flex:wrap", "flex:row", "p:1"]} style={{gap: 5}}>
                {Array.isArray(trucks) ? (trucks.map((truck) => {
                    return(
                        <StyledView classes={["rounded:xl", "bg:grey2", "p:1"]}>
                            <StyledText classes={["text:xs"]}>{truck.name}</StyledText>
                        </StyledView>
                    );
                })) : <StyledText>No Truck</StyledText>}
            </StyledView>
        </StyledOpacity >
    )
}