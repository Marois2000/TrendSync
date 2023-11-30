/**
 * @author Tyler Marois
 */
import { StyledView, StyledText, StyledOpacity } from '../StyleWrappers';
import path from "../path";
import { FontAwesome } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import Toast from 'react-native-root-toast';

export const PDF = ({ unlockScreen, job, customer, toast }) => {
    
    const signContract = async() => {
        const body = {
            customer: customer,
            id: job.job_id
        }
        try {
            const req = await fetch(path+"/trendsync/signcontract", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            const res = await req.json();
            
            unlockScreen(true);

        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <StyledView classes={["flex:1", "items:center", "mt:[25]", "absolute", "bg:background", "w:full", "h:full"]}>
            <StyledView classes={["w:full", "justify:center", "items:end", "bg:background", "py:3", "px:10", "flex:row"]}>
                <StyledText classes={["flex:1", "text-align:center", "text:xl"]}>Contract</StyledText>
                <FontAwesome name="close" size={24} color="black" onPress={() => unlockScreen(false)} />
            </StyledView>

            <StyledView classes={["flex:1", "w:full"]}>
                <WebView source={{uri: `${path}/trendsync/sendcontract/${job.job_id}`}}/>
            </StyledView>

            { job.complete ? null :
                <StyledView classes={["w:full", 'justify:center', 'flex', 'items:center', 'absolute', 'bottom:[10%]']}>
                    <StyledOpacity onPress={signContract} classes={["bg:gray-700", "bg-opacity:25", "px:3", "py:4", "rounded:md"]}><StyledText classes={["color:primary", "text:2xl"]}>Electronically Sign Contract</StyledText></StyledOpacity>
                </StyledView>
            }
            
        </StyledView>
    )
}