import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { TouchableHighlight, Dimensions } from 'react-native';
import { useThemeContext } from '../contexts/ThemeContext';

export function BackSpace({ onPress }) {
    const { theme, setTheme } = useThemeContext();

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const width = screenWidth / 11;

    return (
        <TouchableHighlight
            style={{
                borderWidth: 2,
                height: 48,
                width: width * 1.5,
                borderRadius: 8,
                margin: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme === 'light' ? '#fff' : '#094387',
                position: 'absolute',
            }}
            underlayColor={'#098287'}
            onPress={onPress}
        >
            <FontAwesomeIcon size={32} icon={faLeftLong} color={theme === 'light' ? '#000' : '#fff'} />
        </TouchableHighlight>
    );
}
