/**
 * @author Tyler Marois
 */
import { StyledView, StyledText, StyledOpacity } from '../StyleWrappers';
import { Linking, Platform } from 'react-native';

/**
 * @description Shows the customers details like name, phone, and email
 * 
 * @param {*} first The customers first name
 * @param {*} last The customers last name
 * @param {*} phone The customers phone number
 * @param {*} email The customers email address
 * 
 * @returns A customer details card
 */
export default CustomerInfo = ({ first, last, phone, email }) => {

    /**
     * Capitalizes the first letter of a string
     * 
     * @param {*} string The string to be capitalized
     * @returns A string with a capitalized first letter
     */
    const capFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * @description Opens the devices default native phone application to make a call
     * 
     * @param {*} number The customers phone number
     */
    const onPressMobileNumberClick = (number) => {
        console.log(number);
        let phoneNumber = '';
        if (Platform.OS === 'android') {
          phoneNumber = `tel:${number}`;
        } else {
          phoneNumber = `telprompt:${number}`;
        }
  
        Linking.openURL(phoneNumber);
     }

    return(
        <StyledView classes={["bg:primary2", "w:[80%]", 'justify:start', "items:center", "flex:row", "p:5", "rounded:md"]}>
            <StyledView classes={["bg:background", "w:[64]", "h:[64]", "items:center", "justify:center", "rounded:xl"]}>
                <StyledText classes={["text:3xl", "color:primary"]}>{first.charAt(0).toUpperCase() + last.charAt(0).toUpperCase()}</StyledText>
            </StyledView>

            <StyledView classes={["px:2"]}>
                <StyledText classes={["color:background", "text:xl"]}>{capFirstLetter(first) + " " + capFirstLetter(last)}</StyledText>
                <StyledText classes={["color:background"]}>{email}</StyledText>
                <StyledOpacity onPress={() => onPressMobileNumberClick(phone.replace("-", "").replace("(", "").replace(")", "").replace(" ", ""))}><StyledText classes={["color:background", "text:xl"]}>{phone}</StyledText></StyledOpacity>
            </StyledView>
        </StyledView>
    )
}