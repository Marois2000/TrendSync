/**
 * @author Tyler Marois
 */
import { StyledView, StyledText, StyledOpacity } from '../StyleWrappers';
import { MaterialIcons } from '@expo/vector-icons';

export default ServicesButton = ({ openServices }) => {
    return (
        <StyledView classes={["bg:primary2", "w:[80%]", 'justify:between', "items:center", "flex:row", "p:3", "rounded:md", "mb:10"]}>
            <StyledView classes={["flex:row", "items:center"]}>
                <MaterialIcons name="home-repair-service" size={24} color="#F5F5F5" />
                <StyledText classes={["color:background", "mx:2"]}>Services</StyledText>
            </StyledView>
            <StyledOpacity onPress={openServices}>
                <StyledText classes={["color:background"]}>View</StyledText>
            </StyledOpacity>
        </StyledView>
    )
}
