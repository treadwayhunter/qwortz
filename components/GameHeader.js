import { faArrowLeft, faArrowRight, faArrowsRotate, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export function GameHeader({ level, handleChangeLevel, completed, handleLevelRefresh }) {
    const insets = useSafeAreaInsets();

    const [color, setColor] = useState('#094387');
    const navigation = useNavigation();

    return (
        <View aria-label='infoboard' style={{ width: '100%', paddingTop: insets.top, height: 80 + insets.top, backgroundColor: color, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <TouchableOpacity onPress={() => handleChangeLevel(level - 1)}>
                {level <= 1
                    ? <></>
                    : <FontAwesomeIcon color={'white'} size={32} icon={faArrowLeft} />}
            </TouchableOpacity>
            <Text style={{ fontSize: 32, color: 'white' }}>Level: {level}</Text>
            <TouchableOpacity onPress={() => handleChangeLevel(level + 1)}>
                {completed
                    ? <FontAwesomeIcon color={'white'} size={32} icon={faArrowRight} />
                    : <></>}
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => await handleLevelRefresh()}>
                <FontAwesomeIcon color={'white'} size={32} icon={faArrowsRotate} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate({ name: 'Settings' })}>
                <FontAwesomeIcon color={'white'} size={32} icon={faBars} />
            </TouchableOpacity>
        </View>
    );
}
