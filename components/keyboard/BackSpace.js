import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { TouchableHighlight, Dimensions } from 'react-native';

export function BackSpace({ onPress }) {
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
                backgroundColor: 'white',
                position: 'absolute',
            }}
            underlayColor={'brown'}
            onPress={onPress}
        >
            <FontAwesomeIcon size={32} icon={faLeftLong} />
        </TouchableHighlight>
    );
}
