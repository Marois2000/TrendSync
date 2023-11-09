/**
 * @author Tyler Marois
 */
import { TextInput } from 'react-native';
import { StyledView, StyledText, StyledTextInput } from '../StyleWrappers';

export default InputField = ({ title, onChange, placeholder, value }) => {
    return(
        <StyledView classes={["w:[300]"]}>
            <StyledText classes={["block", "uppercase", "tracking:wide", "color:grey3", "text:xs", "font-weight:bold", "mb:2"]}>{title}</StyledText>
            <StyledTextInput 
                classes={["w:full", "shadow:sm", "bg:grey1", "color:grey3", "border:2", "border-color:primary", "rounded:md", "py:3", "px:4", "mb:3", "leading:tight"]}
                value={value}
                placeholder={placeholder}
                onChangeText={onChange}
            />
        </StyledView>
    )
}