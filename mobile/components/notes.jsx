/**
 * @author Tyler Marois
 */
import { StyledView, StyledText } from '../StyleWrappers';
import { MaterialIcons } from '@expo/vector-icons';


export default Notes = ({ notes }) => {
    return(
        <StyledView classes={["my:3", "rounded:lg", "shadow:2xl", "w:[80%]"]}>
            <StyledView classes={["bg:grey2", "p:2", "flex:row"]}>
                <MaterialIcons name="notes" size={24} color="black" />
                <StyledText classes={["text:xl"]}>Notes</StyledText>
            </StyledView>
            <StyledView classes={["bg:background", "px:1", "py:3"]}>
                <StyledText>{notes}</StyledText>
            </StyledView>
        </StyledView>
    )
}