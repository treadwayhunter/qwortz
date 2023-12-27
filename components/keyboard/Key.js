import { Text, TouchableHighlight, Dimensions } from 'react-native';

export function Key({ letter, onPress }) {
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const width = screenWidth / 11;
    //console.log(width);
    return (
        <TouchableHighlight
            style={{
                borderWidth: 2,
                height: 48,
                width: width,
                borderRadius: 8,
                margin: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white'
            }}
            underlayColor={'#874d09'}
            onPress={() => onPress(letter)}
        >
            <Text style={{ fontSize: width / 1.5 }}>{letter}</Text>
        </TouchableHighlight>
    );
}
