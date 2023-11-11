/**
 * @author Tyler Marois
 */
import { TextInput } from 'react-native';
import { StyledView, StyledText, StyledTextInput, StyledOpacity } from '../StyleWrappers';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';

export default InputField = ({ title, onChange, placeholder, value, hidden }) => {
    const [hidePassword, setHidePassword] = useState(hidden);

    return(
        <StyledView classes={["w:[300]"]}>
            <StyledText classes={["block", "uppercase", "tracking:wide", "color:grey3", "text:xs", "font-weight:bold", "mb:2"]}>{title}</StyledText>
            <StyledView classes={["flex", "items:center", "justify:center"]}>
                <StyledTextInput 
                    classes={["w:full", "shadow:sm", "bg:grey1", "color:grey3", "border:2", "border-color:primary", "rounded:md", "py:3", "px:4", "mb:3", "leading:tight"]}
                    value={value}
                    placeholder={placeholder}
                    onChangeText={onChange}
                    secureTextEntry={hidePassword}
                />
                { title == "Password" ? 
                    <StyledOpacity classes={["absolute", "right:5", "top:3"]}>
                        <MaterialCommunityIcons 
                            name={hidePassword ? 'eye-off' : 'eye'} 
                            size={24} 
                            color="#1B3F9C"
                            onPress={(e) => setHidePassword(!hidePassword)} 
                        /> 
                    </StyledOpacity>
                : null}
            </StyledView>
        </StyledView>
    )
}