/**
 * @author Tyler Marois
 */
import { StyledView, StyledText, StyledScroll, StyledOpacity } from '../StyleWrappers';
import Button from '../components/button';
import { useEffect, useState } from 'react';
import path from "../path";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Customerinfo from '../components/customerinfo';
import Addresses from '../components/addresses';
import { Dimensions } from 'react-native';
import Notes from '../components/notes';
import Jobspecs from '../components/jobspecs';
import Materialsbutton from '../components/materialsbutton';
import Servicesbutton from '../components/servicesbutton';
import MaterialEdit from './materialedit';


export default JobDetails = ({ backToDash, job, customer }) => {
    const [landscape, setLandscape] = useState( Dimensions.get('window').width > Dimensions.get('window').height);
    const [extras, setExtras] = useState(false);
    const [openMaterials, setOpenMaterials] = useState(false);
    
    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', (e) => {
            const { width, height } = e.window;
            if(width > height) {
                setLandscape(true);
            } else {
                setLandscape(false);
            }
        })
        
        return () => subscription?.remove();
    });


    return(
        <StyledView classes={["flex:1", "justify:start", "items:center", "bg:background", "w:full"]}>
            <StyledView classes={["justify:start", "items:end", "bg:background", "w:full", "flex:row", "pb:2", "mt:10"]}>
                <StyledOpacity onPress={backToDash}><StyledText classes={["color:primary", "text:2xl", "mx:2"]}>{"< Back"}</StyledText></StyledOpacity>
            </StyledView>


            {!landscape ? 
                <StyledScroll classes={["flex:1", "bg:background", "w:full"]} contentContainerStyle={{alignItems:'center'}}>
                    <StyledView classes={["w:full", "bg:primary", "justify:center", "items:center", "py:3"]}>
                        <Customerinfo first={customer.first_name} last={customer.last_name} email={customer.email} phone={customer.phone}/>

                        {!extras ? 
                            <StyledOpacity onPress={() => setExtras(true)} classes={["border:1", "border-color:background", "w:[80%]", "m:2", "rounded:md"]}>
                                <StyledText classes={["color:background", "text-align:center", "text:xl"]}>See More</StyledText>
                            </StyledOpacity>
                        : 
                            <StyledView classes={["w:full", "justify:center", "items:center"]}>
                                <Jobspecs rate={job.rate} estimate={job.estimate} crewNum={job.num_crew} truckNum={job.num_trucks}/>
                                <Materialsbutton openMaterials={() => setOpenMaterials(true)} job={job.job_id}/>
                                <Servicesbutton />
                                <StyledOpacity onPress={() => setExtras(false)} classes={["border:1", "border-color:background", "w:[80%]", "m:2", "rounded:md"]}>
                                    <StyledText classes={["color:background", "text-align:center", "text:xl"]}>See Less</StyledText>
                                </StyledOpacity>
                            </StyledView>
                        }
                    </StyledView>

                    <Addresses pickup={job.pickup} dropoff={job.dropoff} />
                    <Notes notes={job.notes}/>
                </StyledScroll>
            : 
                <StyledView classes={["flex:1", "justify:start", "items:start", "bg:background", "w:full", "flex:row", "h:full"]}>
                    <StyledScroll classes={["flex:1", "bg:primary", "h:full", "py:3"]} contentContainerStyle={{alignItems:'center'}}>
                        <Customerinfo first={customer.first_name} last={customer.last_name} email={customer.email} phone={customer.phone}/>
                        
                        <StyledView classes={["w:full", "justify:center", "items:center"]}>
                            <Jobspecs rate={job.rate} estimate={job.estimate} crewNum={job.num_crew} truckNum={job.num_trucks}/>
                            <Materialsbutton openMaterials={() => setOpenMaterials(true)} />
                            <Servicesbutton />
                        </StyledView>
                    </StyledScroll>
                    

                    <StyledScroll classes={["flex:1", "bg:background", "h:full"]} contentContainerStyle={{alignItems:'center'}}>
                        <Addresses pickup={job.pickup} dropoff={job.dropoff} />
                        <Notes notes={job.notes}/>
                    </StyledScroll>
                </StyledView>
            }
            
            {openMaterials ? <MaterialEdit close={() => setOpenMaterials(false)} job={job}/> : null}


        </StyledView>
    )
}