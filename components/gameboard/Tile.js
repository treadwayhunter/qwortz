import { View, Text, TouchableHighlight } from "react-native";
import { useThemeContext } from "../contexts/ThemeContext";

export function Tile({ letter, valid, index, handlePress, locked }) {

    const { theme, setTheme } = useThemeContext();


    let color = theme === 'light' ? '#fff' : '#121212'
    if (valid === 'good') {
        color = '#0b9f5b';
    }
    else if (valid === 'bad') {
        color = '#b7130c';
    }
    else if (valid === 'used') {
        color = '#df9f5d';
    }



    return (
   
        <TouchableHighlight style={{
            height: 50,
            width: 50,
            borderBottomWidth: 3,
            borderWidth: letter ? 3 : 0,
            borderRadius: letter ? 8 : 0,
            borderColor: theme === 'light' ? '#000' : '#fff',
            margin: 3,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: color
        }}
            onPress={() => handlePress(index)}
            underlayColor={'#098287'}
            disabled={letter ? false : true}
        >
            <Text style={{ fontSize: 32, color: theme === 'light' ? '#000' : '#fff' }}>{letter}</Text>
        </TouchableHighlight>
      
  
    );
}

//            borderColor: theme === 'light' ? '#000' : '#098287',
