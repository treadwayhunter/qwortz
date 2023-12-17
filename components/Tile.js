import { View, Text } from "react-native";

export function Tile({ letter, valid }) {

    let color = 'white';
    if (valid === 'good') {
        color = 'lightgreen';
    }
    else if (valid === 'bad') {
        color = 'red';
    }

    return (
        <View style={{
            height: 50,
            width: 50,
            borderBottomWidth: 3,
            borderWidth: letter ? 3 : 0,
            borderRadius: letter ? 8 : 0,
            margin: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: color
        }}>
            <Text style={{ fontSize: 32 }}>{letter}</Text>
        </View>
    );
}
