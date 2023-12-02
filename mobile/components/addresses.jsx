/**
 * @author Tyler Marois
 */
import { StyledView, StyledText, StyledOpacity } from '../StyleWrappers';
import { Linking, Platform } from 'react-native';
import { Entypo } from '@expo/vector-icons';

/**
 * @description Shows the addresses of the job
 * 
 * @param {*} pickup The address the job picks up from
 * @param {*} dropoff The address of the jobs dropoff
 * 
 * @returns A card showing 2 addresses for the job
 */
export default Addresses = ({ pickup, dropoff}) => {

    /**
     * @description Opens the devices default native map viewer
     * 
     * @param {*} address The address to look up
     */
    const openMaps = (address) => {
        if(Platform.OS == 'android') {
            Linking.openURL(`geo://0,0?q=${address}`);
        } else {
            Linking.openURL(`maps://0,0?q=${address}`);
        }
    }

    return(
        <StyledView classes={["my:3", "rounded:lg", "shadow:2xl", "w:[80%]"]}>
            <StyledView classes={["bg:grey2", "p:2", "flex:row"]}>
                <Entypo name="location-pin" size={24} color="black" />
                <StyledText classes={["text:xl"]}>Stops</StyledText>
            </StyledView>
            <StyledView classes={["bg:background", "px:3"]}>
                <StyledOpacity onPress={() => openMaps(pickup)}>
                    <StyledText classes={["color:primary", "my:2", "text-align:left", "w:[70%]"]}>{pickup}</StyledText>
                </StyledOpacity>

                <StyledOpacity onPress={() => openMaps(dropoff)}>
                    <StyledText classes={["color:primary", "my:2", "text-align:left", "w:[70%]"]}>{dropoff}</StyledText>
                </StyledOpacity>
            </StyledView>
        </StyledView>
    )
}