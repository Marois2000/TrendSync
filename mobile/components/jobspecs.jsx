/**
 * @author Tyler Marois
 */
import { StyledView, StyledText } from '../StyleWrappers';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

export default JobSpecs = ({ rate, crewNum, truckNum, estimate }) => {
    return (
        <StyledView classes={["bg:primary2", "w:[80%]", 'justify:start', "items:center", "my:2", "rounded:md"]}>
            <StyledView classes={["flex:row", "justify:between", "p:2", "flex:1", "w:full", "items:center"]}>
                <StyledText classes={["text:lg", "color:background"]}>Rate</StyledText>
                <StyledText classes={["text:lg", "color:background"]}>{"$" + rate + "/hr"}</StyledText>
            </StyledView>

            <StyledView classes={["flex:row", "justify:between", "p:2", "flex:1", "w:full", "items:center"]}>
                <StyledText classes={["text:lg", "color:background"]}>Crew</StyledText>
                <StyledView classes={["items:center", "justify:around", "flex:row"]}>
                    <Ionicons name="people" size={24} color="#F5F5F5" />
                    <StyledText classes={["color:background", "mr:4", "ml:1"]}>{crewNum}</StyledText>
                    <FontAwesome5 name="truck" size={24} color="#F5F5F5" />
                    <StyledText classes={["color:background", "ml:1"]}>{truckNum}</StyledText>

                </StyledView>
            </StyledView>

            <StyledView classes={["flex:row", "justify:between", "p:2", "flex:1", "w:full", "items:center"]}>
                <StyledText classes={["text:lg", "color:background"]}>Estimate</StyledText>
                <StyledText classes={["text:lg", "color:background"]}>{estimate + "h"}</StyledText>
            </StyledView>
        </StyledView>
    )
}