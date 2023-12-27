import { View, Text, TouchableHighlight } from "react-native";

export function Tile({ letter, valid, index, handlePress, locked }) {

    let color = 'white';
    if (valid === 'good') {
        color = 'lightgreen';
    }
    else if (valid === 'bad') {
        color = 'red';
    }
    else if (valid === 'used') {
        color = '#f8b168';
    }



    return (
   
        <TouchableHighlight style={{
            height: 50,
            width: 50,
            borderBottomWidth: 3,
            borderWidth: letter ? 3 : 0,
            borderRadius: letter ? 8 : 0,
            margin: 3,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: color
        }}
            onPress={() => handlePress(index)}
            underlayColor={'#874d09'}
            disabled={letter ? false : true}
        >
            <Text style={{ fontSize: 32 }}>{letter}</Text>
        </TouchableHighlight>
      
  
    );
}
