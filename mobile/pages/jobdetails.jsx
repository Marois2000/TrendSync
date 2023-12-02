/**
 * @author Tyler Marois
 */
import { StyledView, StyledText, StyledScroll, StyledOpacity } from '../StyleWrappers';
import { useEffect, useState } from 'react';
import path from "../path";
import Customerinfo from '../components/customerinfo';
import Addresses from '../components/addresses';
import { Dimensions } from 'react-native';
import Notes from '../components/notes';
import Jobspecs from '../components/jobspecs';
import Materialsbutton from '../components/materialsbutton';
import Servicesbutton from '../components/servicesbutton';
import MaterialEdit from './materialedit';
import ServiceEdit from './serviceedit';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from 'react-native-root-toast';
import CompleteJob from "./completejob";
import { AntDesign } from '@expo/vector-icons';
import { PDF } from "../components/pdf.jsx";

/**
 * @description The jobs details/working page
 * 
 * @param {*} backToDash Closes the details page
 * @param {*} job The current job
 * @param {*} customer The jobs customer
 * @param {*} user The logged in user
 * 
 * @returns A job details page
 */
export default JobDetails = ({ backToDash, job, customer, user }) => {
    const [landscape, setLandscape] = useState( Dimensions.get('window').width > Dimensions.get('window').height); // Determines if in landscape or not
    const [extras, setExtras] = useState(false); // Determines if extra details are open or not
    const [openMaterials, setOpenMaterials] = useState(false); // Determines if materials page is open
    const [openServices, setOpenServices] = useState(false); // Determines if the services page is open

    const [settingStart, setSettingStart] = useState(false); // Determines if start has been set
    const [settingEnd, setSettingEnd] = useState(false); // Determines if end has been set
    const [completingJob, setCompletingJob] = useState(false); // Determines if completing job has been set

    const [openPDF, setOpenPDF] = useState(false); // Determines if viewing the contract

    
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

    /**
     * @description Call API and set jobs start time
     * 
     * @param {*} time The time to set
     */
    const handleStartTime = async (time) => {
        const body = {
            id: job.job_id,
            time: time
        }
        
        job.start_time = time;

        try {
            Toast.show('Start Time Set!', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.TOP,
                backgroundColor: '#4BB543',
                opacity: 90,
            });
            
            const req = await fetch(path+"/trendsync/startjob", {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * @description Calls the API and sets the jobs end time
     *  
     * @param {*} time The time to set
     */
    const handleEndTime = async (time) => {
        const body = {
            id: job.job_id,
            time: time
        }
        
        job.end_time = time;

        try {
            Toast.show('End Time Set!', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.TOP,
                backgroundColor: '#4BB543',
                opacity: 90,
            });
            
            const req = await fetch(path+"/trendsync/endjob", {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * @description Closes the contract viewer
     * 
     * @param {*} signed If true the contract will be signed
     */
    const unlockScreen = (signed) => {
        if(signed) {
            Toast.show('Contract Signed!', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.TOP,
                backgroundColor: '#4BB543',
                opacity: 90,
            });
        } 
        setOpenPDF(false);
    }

    return(
        <StyledView classes={["flex:1", "justify:start", "items:center", "bg:background", "w:full"]}>
            <StyledView classes={["justify:between", "items:end", "bg:background", "w:full", "flex:row", "pb:2", "mt:10"]}>
                <StyledOpacity onPress={backToDash}><StyledText classes={["color:primary", "text:2xl", "mx:2"]}>{"< Back"}</StyledText></StyledOpacity>
                <StyledOpacity onPress={() => setOpenPDF(true)} classes={["px:3"]}><AntDesign name="pdffile1" size={24} color="#1B3F9C" /></StyledOpacity>
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
                                <Materialsbutton openMaterials={() => setOpenMaterials(true)} />
                                <Servicesbutton openServices={() => setOpenServices(true)} />
                                <StyledOpacity onPress={() => setExtras(false)} classes={["border:1", "border-color:background", "w:[80%]", "m:2", "rounded:md"]}>
                                    <StyledText classes={["color:background", "text-align:center", "text:xl"]}>See Less</StyledText>
                                </StyledOpacity>
                            </StyledView>
                        }
                    </StyledView>

                    <Addresses pickup={job.pickup} dropoff={job.dropoff} />
                    <Notes notes={job.notes}/>

                    {job.start_time == undefined ? 
                        <StyledOpacity onPress={() => setSettingStart(true)} classes={["mb:20", "mt:5", "bg:primary", "border:2", "w:[80%]", "flex", "justify:center", "items:center"]}>
                            <StyledText classes={["color:background", "text:2xl"]}>Start Job</StyledText>
                        </StyledOpacity> 
                    : null}

                    {job.start_time != undefined && job.end_time == undefined ? 
                        <StyledOpacity onPress={() => setSettingEnd(true)} classes={["mb:20", "mt:5", "bg:primary", "border:2", "w:[80%]", "flex", "justify:center", "items:center"]}>
                            <StyledText classes={["color:background", "text:2xl"]}>End Job</StyledText>
                        </StyledOpacity> 
                    : null}

                    {job.start_time != undefined && job.end_time != undefined && !job.complete ? 
                        <StyledOpacity onPress={() => setCompletingJob(true)} classes={["mb:20", "mt:5", "bg:primary", "border:2", "w:[80%]", "flex", "justify:center", "items:center"]}>
                            <StyledText classes={["color:background", "text:2xl"]}>Complete Job</StyledText>
                        </StyledOpacity> 
                    : null}

                </StyledScroll>
            : 
                <StyledView classes={["flex:1", "justify:start", "items:start", "bg:background", "w:full", "flex:row", "h:full"]}>
                    <StyledScroll classes={["flex:1", "bg:primary", "h:full", "py:3"]} contentContainerStyle={{alignItems:'center'}}>
                        <Customerinfo first={customer.first_name} last={customer.last_name} email={customer.email} phone={customer.phone}/>
                        
                        <StyledView classes={["w:full", "justify:center", "items:center"]}>
                            <Jobspecs rate={job.rate} estimate={job.estimate} crewNum={job.num_crew} truckNum={job.num_trucks}/>
                            <Materialsbutton openMaterials={() => setOpenMaterials(true)} />
                            <Servicesbutton openServices={() => setOpenServices(true)} />
                        </StyledView>
                    </StyledScroll>
                    

                    <StyledScroll classes={["flex:1", "bg:background", "h:full"]} contentContainerStyle={{alignItems:'center'}}>
                        <Addresses pickup={job.pickup} dropoff={job.dropoff} />
                        <Notes notes={job.notes}/>

                        {job.start_time == undefined ? 
                            <StyledOpacity onPress={() => setSettingStart(true)} classes={["mb:20", "mt:5", "bg:primary", "border:2", "w:[80%]", "flex", "justify:center", "items:center"]}>
                                <StyledText classes={["color:background", "text:2xl"]}>Start Job</StyledText>
                            </StyledOpacity> 
                        : null}

                        {job.start_time != undefined && job.end_time == undefined ? 
                            <StyledOpacity onPress={() => setSettingEnd(true)} classes={["mb:20", "mt:5", "bg:primary", "border:2", "w:[80%]", "flex", "justify:center", "items:center"]}>
                                <StyledText classes={["color:background", "text:2xl"]}>End Job</StyledText>
                            </StyledOpacity> 
                        : null}

                        {job.start_time != undefined && job.end_time != undefined && !job.complete ? 
                            <StyledOpacity onPress={() => setCompletingJob(true)} classes={["mb:20", "mt:5", "bg:primary", "border:2", "w:[80%]", "flex", "justify:center", "items:center"]}>
                                <StyledText classes={["color:background", "text:2xl"]}>Complete Job</StyledText>
                            </StyledOpacity> 
                        : null}
                    </StyledScroll>
                </StyledView>
            }
            
            {openMaterials ? <MaterialEdit close={() => setOpenMaterials(false)} job={job} user={user}/> : null}
            {openServices ? <ServiceEdit close={() => setOpenServices(false)} job={job} user={user}/> : null}
            {completingJob ? <CompleteJob close={() => setCompletingJob(false)} job={job} user={user} toast={Toast}/> : null}
            {openPDF ? <PDF unlockScreen={unlockScreen} job={job} customer={customer} /> : null}


            <DateTimePickerModal
                isVisible={settingStart}
                mode="time"
                onConfirm={(time) => handleStartTime(time.getHours() + ":" + time.getMinutes())}
                onCancel={() => setSettingStart(false)}
            />

            <DateTimePickerModal
                isVisible={settingEnd}
                mode="time"
                onConfirm={(time) => handleEndTime(time.getHours() + ":" + time.getMinutes())}
                onCancel={() => setSettingEnd(false)}
            />


        </StyledView>
    )
}