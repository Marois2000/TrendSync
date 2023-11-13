/**
 * @author Tyler Marois
 */
import { StyledView, StyledText, StyledOpacity } from '../StyleWrappers';
import { Feather } from '@expo/vector-icons';

export default MaterialsButton = ({ openMaterials }) => {
    return (
        <StyledView classes={["bg:primary2", "w:[80%]", 'justify:between', "items:center", "flex:row", "p:3", "rounded:md", "m:3"]}>
            <StyledView classes={["flex:row", "items:center"]}>
                <Feather name="package" size={24} color="#F5F5F5" />
                <StyledText classes={["color:background", "mx:2"]}>Materials</StyledText>
            </StyledView>
            <StyledOpacity onPress={openMaterials}>
                <StyledText classes={["color:background"]}>View</StyledText>
            </StyledOpacity>
        </StyledView>
    )
}
