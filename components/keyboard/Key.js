import { Text, TouchableHighlight, Dimensions } from 'react-native';
import { useThemeContext } from '../contexts/ThemeContext';

export function Key({ letter, onPress }) {
    
    const { theme, setTheme } = useThemeContext();

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
                backgroundColor: theme === 'light' ? '#fff' : '#098287'
            }}
            underlayColor={'#874d09'}
            onPress={() => onPress(letter)}
        >
            <Text style={{ fontSize: width / 1.5, color: theme === 'light' ? '#000' : '#fff' }}>{letter}</Text>
        </TouchableHighlight>
    );
}
