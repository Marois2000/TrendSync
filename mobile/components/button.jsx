/**
 * @author Tyler Marois
 */
import { StyledText, StyledOpacity } from '../StyleWrappers';


export default Button = ({ text, update }) => {
    return (
        <StyledOpacity classes={["bg:secondary2", "py:3", "px:4", "rounded:xl", "m:4", "border:1", "border-color:secondary3"]} onPress={update}>
            <StyledText classes={["color:background"]}>{text}</StyledText>
        </StyledOpacity>
    )
}