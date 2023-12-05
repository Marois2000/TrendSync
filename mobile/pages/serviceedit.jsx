/**
 * @author Tyler Marois
 */
import { StyledView, StyledText, StyledScroll, StyledOpacity, StyledTextInput } from '../StyleWrappers';
import { FontAwesome, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import Toast from 'react-native-root-toast';

/**
 * @description Lets users edit services for a job
 * 
 * @param {*} close Closes the page when set to false
 * @param {*} job The current job
 * @param {*} user The current user
 * 
 * @returns The service edit page
 */
export default ServiceEdit = ({ close, job, user }) => {
    const [unusedServices, setUnusedServices] = useState([]); // All the unused services
    const [usedServices, setUsedServices] = useState([]); // The services in use
    const [total, setTotal] = useState(0.00); // price of all the services


    useEffect(() => {
        calculateTotal();
    }, [usedServices]);

    useEffect(() => {
        changeScreenOrientation();
    });

    /**
     * @description Lock the screen to landscape
     */
    async function changeScreenOrientation() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
    }

    /**
     * @description Unlock the screens orientation
     */
    async function unlockScreen() {
        ScreenOrientation.unlockAsync();
        close();
    }

    useEffect(() => {
        getServices();
        getServicesUsed();
    }, []);

    /**
     * @description Get all possible services
     */
    const getServices = async() => {

        const body = {
            jobId: job.job_id
        }
        
        try {
            const req = await fetch(path+"/trendsync/getservices", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const res = await req.json();
            
            setUnusedServices(res);
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * @description The services the job is already using
     */
    const getServicesUsed = async() => {
        const body = {
            jobId: job.job_id
        }

        try {
            const req = await fetch(path+"/trendsync/getservicesinuse", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const res = await req.json();
            
            setUsedServices(res);
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * @description Add a service to the in use services
     * 
     * @param {*} service The service to be added
     */
    const addServiceToUsed = (service) => {
        const newService = {
            job_id: job.job_id,
            service_id: service.service_id,
            name: service.name,
            quantity: 1,
            price: service.price
        }

        setUnusedServices(unusedServices.filter((unusedService) => unusedService != service));
        setUsedServices([... usedServices, newService]);
    }

    /**
     * @description Updates a services quantity on a job
     * 
     * @param {*} value the value to set quantity to
     * @param {*} index Index in the service array
     * @param {*} stepping If we are increasing with buttons
     * @param {*} stepper The value to step by
     */
    const setServiceQuantity = (value, index, stepping, stepper) => {
        const services = usedServices;
        if(isNaN(value)) {
            value = services[index].quantity;
        } else if(value == "" || value < 0) {
            value = 0;
        }
        if(stepping) {
            if(services[index].quantity + stepper > 0) {
                services[index].quantity = Number(services[index].quantity + stepper);
            }
        } else {
            services[index].quantity = value;
        }
        setUsedServices([... services]);
    }

    /**
     * @description Removes a service from the in use array
     * 
     * @param {*} service The service to be removed
     */
    const removeFromUsedServices = (service) => {
        const newService = {
            service_id: service.service_id,
            name: service.name,
            price: service.price
        }

        setUsedServices(usedServices.filter((used) => used != service));
        setUnusedServices([...unusedServices, newService]);
    }

    /**
     * @description The total of all the services added up
     */
    const calculateTotal = () => {
        let cost = 0.00;
        usedServices.forEach(service => {
            cost += service.price * service.quantity;
        });

        const formattedDollarAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(cost);

        setTotal(formattedDollarAmount);
    }

    /**
     * @description Call the API and set the jobs new services
     */
    const updateServices = async() => {

        let services = [];
        usedServices.forEach(service => {
            services = [...services, {
                job_id: service.job_id,
                service_id: service.service_id,
                quantity: service.quantity
            }]
        });


        const body = {
            jobId: job.job_id,
            services: services
        }
        console.log(body);
        

        try {
            Toast.show('Services Saved!', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.TOP,
                backgroundColor: '#4BB543',
                opacity: 90,
            });
            
            const req = await fetch(path+"/trendsync/updateservices", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            
            
            getServices();
            getServicesUsed();
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <KeyboardAvoidingView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#F5F5F5", position: 'absolute', width: '100%', height: '100%', zIndex: 10}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
            <StyledView classes={["w:full", "justify:center", "items:end", "bg:background", "py:3", "px:10", "flex:row"]}>
                <StyledText classes={["flex:1", "text-align:center", "text:xl"]}>Services</StyledText>
                <FontAwesome name="close" size={24} color="black" onPress={unlockScreen} />
            </StyledView>

            <StyledView classes={["flex:1", "w:full", "bg:background", "flex:row"]}>
                <StyledScroll classes={["flex:1", "bg:primary", "h:full"]} contentContainerStyle={{alignItems:'center'}}>
                    {unusedServices.map((service, index) => {
                        return(
                            <StyledView classes={["w:[80%]", "m:2", "p:2", "bg:primary2", "flex:row", "justify:between"]} key={index}>
                                <StyledText classes={["text:lg", "color:background", "text-align:left"]} >{service.name}</StyledText>
                                
                                {user.rank > 0 && !job.complete ? 
                                    <Entypo name="plus" size={24} color="#F5F5F5" onPress={() => addServiceToUsed(service)} />
                                : null }
                            </StyledView>

                            
                        )
                    })}
                </StyledScroll>


                <StyledView classes={["flex:1", "bg:background", "h:full"]}>
                    <StyledScroll classes={["flex:1", "bg:background", "h:full"]} contentContainerStyle={{alignItems:'center'}}>
                        {usedServices.map((service, index) => {
                            return(
                                <StyledView classes={["w:[80%]", "m:2", "p:2", "bg:grey1", "flex:row", "justify:between", "items:center"]} key={index}>
                                    <StyledText classes={["text:lg", "color:primary", "text-align:left", "w:[40%]"]} key={index}>{service.name}</StyledText>

                                    {user.rank > 0 && !job.complete ? 
                                        <StyledView classes={["flex:row", "flex:1", "justify:center", "items:center"]}>
                                            <MaterialCommunityIcons name='chevron-left' size={24} color="#1B3F9C" onPress={() => setServiceQuantity(1, index, true, -1)}/>
                                            <StyledTextInput value={`${service.quantity}`} onChangeText={(e) => setServiceQuantity(e, index, false, 0)} keyboardType='numeric'  classes={["bg:grey2", "rounded:md", "p:1", "mx:3"]}/>
                                            <MaterialCommunityIcons name='chevron-right' size={24} color="#1B3F9C" onPress={() => setServiceQuantity(1, index, true, 1)}/>
                                        </StyledView>
                                    : <StyledText classes={["bg:grey2", "rounded:md", "p:1", "mx:3"]}>{`${service.quantity}`}</StyledText> }

                                    {user.rank > 0 && !job.complete ? 
                                        <FontAwesome name="close" size={24} color="#1B3F9C" onPress={() => removeFromUsedServices(service)} />
                                    : null }
                                </StyledView>
                            )
                        })}
                    </StyledScroll>

                    <StyledView classes={["w:full", "bg:primary", "justify:around", "items:center", "p:4", "flex:row"]}>
                        <StyledView classes={["bg:primary2", "px:5", "py:2", "justify:between", "flex:row", "items:center", "w:[50%]"]}>
                            <StyledText classes={["color:background", "text:lg", "text-align:left"]}>Total</StyledText>
                            <StyledText classes={["color:background", "text:lg", "text-align:right"]}>{total}</StyledText>
                        </StyledView>
                        
                        {user.rank > 0 && !job.complete ? 
                            <StyledOpacity classes={["border:1", "px:5", "py:2", "border-color:background", "rounded:lg"]} onPress={updateServices}>
                                <StyledText classes={["color:background", "text:xl"]}>Save Changes</StyledText>
                            </StyledOpacity>
                        : null }

                    </StyledView>
                </StyledView>
                
            </StyledView>
        </KeyboardAvoidingView>
    )
}