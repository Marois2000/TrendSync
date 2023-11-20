/**
 * @author Tyler Marois
 */
import { StyledView, StyledText, StyledScroll, StyledOpacity } from '../StyleWrappers';
import { Linking, Platform } from 'react-native'

export default CustomerInfo = ({ first, last, phone, email }) => {

    const capFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

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