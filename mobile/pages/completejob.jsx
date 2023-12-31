/**
 * @author Tyler Marois
 */
import { StyledView, StyledText, StyledTextInput } from '../StyleWrappers';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView } from 'react-native';
import Toast from 'react-native-root-toast';

/**
 * @description Ends the job and takes payment or updates customers balance
 * 
 * @param {*} close closes the page when set to false
 * @param {*} job The current job
 * @param {*} toast The pop up message
 * 
 * @returns A page showing the jobs total and takes payment
 */
export default CompleteJob = ({ close, job, toast }) => {
    const [total, setTotal] = useState(0.0); // The total of the job
    const [payment, setPayment] = useState(0.0); // The current payment being made
    const [balance, setBalance] = useState(total - payment); // The remaineder of the total - the payment

    useEffect(() => {
        getTotal();
    }, [])

    /**
     * @description Gets the jobs total from the API call
     */
    const getTotal = async () => {
        const body = {
            id: job.job_id,
        }
        try {
            const req = await fetch(path+"/trendsync/jobtotal", {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const res = await req.json();

            setTotal(res);
            setBalance(res - payment);
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * @description Changes the balance when the payment changes
     * 
     * @param {*} num The new payment
     */
    const changeBalance = (num) => {
        
        if(num < 0) {
            num = 0;
        } else if(num > total) {
            num = total;
        } 

        if(isNaN(total - parseInt(num))) {
            setBalance(total);
        } else {
            setBalance(total - parseInt(num));
        }

        setPayment(parseInt(num));
    }

    /**
     * @description Close the keyboard when clicked away
     */
    const getRidOfKeyboard = () => {
        Keyboard.dismiss();
    }

    /**
     * @description Sets the job as finished by calling the API
     */
    const finishJob = async() => {
        const body = {
            customerId: job.customer_id,
            balance: balance,
            jobId: job.job_id
        }
        try {
            const req = await fetch(path+"/trendsync/finishjob", {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            toast.show('Job Completed!', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.TOP,
                backgroundColor: '#4BB543',
                opacity: 90,
            });
            
            job.complete = true;
            close(false);
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <KeyboardAvoidingView   style={{flex: 1, justifyContent: 'start', alignItems: 'start', backgroundColor: "#F5F5F5", position: 'absolute', width: '100%', height: '100%', zIndex: 10}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
            <StyledView onTouchEndCapture={getRidOfKeyboard} classes={["w:full", "justify:between", "items:end", "bg:primary", "pt:10", "px:10", "flex:row", "h:[10%]", "pb:2"]}>
                <StyledText classes={["text-align:left", "text:2xl", "color:background"]}>Complete Job</StyledText>
                <FontAwesome name="close" size={24} color="white" onPress={close} />
            </StyledView>

            <StyledView classes={["w:full", "justify:around", "items:end", "flex:row", "mt:10"]} onTouchEndCapture={getRidOfKeyboard}>
                <StyledText classes={["text:2xl"]}>Job Total</StyledText>
                <StyledText classes={["text:2xl"]}>{new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                }).format(total)}</StyledText>
            </StyledView>

            <StyledView classes={["w:full", "justify:center", "items:center", "mt:10", "bg:grey1", "p:2"]}>
                <StyledText classes={["text:4xl"]}>Pay Now</StyledText>
                <StyledView classes={["w:full", "justify:between", "flex:row", "p:5"]}>
                    <StyledText classes={["text:3xl"]}>Payment</StyledText>
                    <StyledTextInput value={payment} onChangeText={num => changeBalance(num)} keyboardType='numeric' classes={["bg:background", "rounded:md", "p:1", "mx:3", "w:[50%]", "border:2", "border-color:secondary2", "text-align:right"]} />
                </StyledView>

                <StyledView classes={["w:full", "justify:between", "flex:row", "p:5"]}>
                    <StyledText classes={["text:3xl"]}>Balance</StyledText>
                    <StyledText classes={["text:3xl"]}>{new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                    }).format(balance)}</StyledText>
                </StyledView>
            </StyledView>

            <StyledView classes={["justify:center", "items:center", "w:full", "py:20"]} onTouchEndCapture={getRidOfKeyboard}>
                    <Button text={balance == 0 ? "Complete Job" : "Bill to Account and Complete Job"} update={finishJob}/>
            </StyledView>
           
        </KeyboardAvoidingView>
    )
}