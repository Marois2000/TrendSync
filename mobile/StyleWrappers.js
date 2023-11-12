import { createStyleBuilder } from "react-native-zephyr";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";

const { styles, useStyles, makeStyledComponent } = createStyleBuilder({
    extendTheme: {
      colors: {
        primary: '#1B3F9C',
        primary2: '#0D2A75',
        secondary1: '#f59a4e',
        secondary2: '#F4872C',
        secondary3: '#b55607',
        background: '#F5F5F5',
        grey1: '#D9D9D9',
        grey2: '#BFB7B7',
        grey3: '#374151'
      }
    },
    gap: {
      
    }
  });

export const StyledView = makeStyledComponent(View);
export const StyledText = makeStyledComponent(Text);
export const StyledTextInput = makeStyledComponent(TextInput);
export const StyledOpacity = makeStyledComponent(TouchableOpacity);
export const StyledScroll = makeStyledComponent(ScrollView);




// primary: '#1B3F9C',
//         secondary: {
//             100: '#f59a4e',
//             200: '#F4872C',
//             300: '#b55607'
//         },
//         background: '#F5F5F5',
//         grey: {
//             100: '#D9D9D9',
//             200: '#BFB7B7',
//         }