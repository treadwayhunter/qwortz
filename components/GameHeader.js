import { faArrowLeft, faArrowRight, faArrowsRotate, faBars, faHouse, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from './contexts/ThemeContext';

export function GameHeader({ level, handleChangeLevel, completed, handleLevelRefresh }) {
    const insets = useSafeAreaInsets();
    const { theme, setTheme } = useThemeContext();

    const [color, setColor] = useState('#094387');
    const navigation = useNavigation();

    return (
        <View aria-label='Gameheader' style={{ width: '100%', paddingTop: insets.top, height: 80 + insets.top, backgroundColor: theme === 'light' ? '#094387' : '#121212', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            <View style={{ height: '100%', width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate({name: 'Home'})}>
                    <FontAwesomeIcon color='white' size={32} icon={faHouse} />
                </TouchableOpacity>
            </View>
            <View style={{ height: '100%', width: '60%', flexDirection: 'row' }}>
                <View style={{ height: '100%', width: '25%', alignItems: 'center', justifyContent: 'center' }}>
                    {level <= 1
                        ? <></>
                        : <TouchableOpacity onPress={() => handleChangeLevel(level - 1)}>
                            <FontAwesomeIcon icon={faArrowLeft} size={32} color='white' />
                        </TouchableOpacity>
                    }
                </View>
                <View style={{ height: '100%', width: '50%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity style={{
                        height: '100%',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}
                        onPress={() => navigation.navigate({ name: 'Levels' })}
                    >
                        <Text style={{ fontSize: 32, color: 'white' }}>{level}</Text>
                        <FontAwesomeIcon icon={faCaretDown} color='white' />
                    </TouchableOpacity>
                </View>
                <View style={{ height: '100%', width: '25%', alignItems: 'center', justifyContent: 'center' }}>
                    {completed
                        ? <TouchableOpacity onPress={() => handleChangeLevel(level + 1)}>
                            <FontAwesomeIcon icon={faArrowRight} size={32} color='white' />
                        </TouchableOpacity>
                        : <></>
                    }
                </View>

            </View>
            <View style={{ height: '100%', width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate({ name: 'Settings' })}>
                    <FontAwesomeIcon color='white' size={32} icon={faBars} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

// level needs to be centered, and have an arrow on either side. The lack of the arrow should not resize the section
// perhaps a home button? If they wanted to go home for some reason.
