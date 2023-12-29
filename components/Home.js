import { View, Text, TouchableHighlight, Switch } from 'react-native';
import { useGameContext } from './contexts/GameContext';
import { useEffect, useState } from 'react';
import { getNumLevels } from '../data/database';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeSwitch from './ThemeSwitch';
import { useThemeContext } from './contexts/ThemeContext';

function HomeButton({ value, callback }) {

    const { theme, setTheme } = useThemeContext();

    return (
        <TouchableHighlight
            style={{
                height: 60,
                width: '75%',
                borderWidth: 3,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                margin: 8,
                backgroundColor: theme === 'light' ? '#fff' : '#2c2c2c',
                borderColor: theme === 'light' ? '#000' : '#098287'
            }}
            underlayColor={'#098287'}
            onPress={callback}
        >
            <Text style={{ fontSize: 28, color: theme === 'light' ? '#000' : '#fff' }}>{value}</Text>
        </TouchableHighlight>
    );
}

export default function Home() {
    const [inProgressLevel, setInProgressLevel] = useState(0);
    const { gameState, gameDispatch } = useGameContext();
    const { theme, setTheme } = useThemeContext();

    const navigation = useNavigation();

    // needs to show the level in progress, not the current selected level...
    useEffect(() => {
        getNumLevels()
            .then((value) => {
                const progress = value + 1;
                setInProgressLevel(progress);
            });
    });

    function handleLevelStart() {
        AsyncStorage.setItem('level', String(inProgressLevel));
        gameDispatch({ type: 'CHANGE_LEVEL', payload: inProgressLevel });
        navigation.navigate({ name: 'Game' });
    }

    const levelText = `Level ${inProgressLevel}`;

    return (
        <View style={{ flex: 1, width: '100%', backgroundColor: theme === 'light' ? '#fff' : '#121212' }}>
            <View style={{ height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 64, color: theme === 'light' ? '#000' : '#fff' }}>Qwortz</Text>
            </View>
            <View style={{ height: '100%', alignItems: 'center' }}>
                <HomeButton value={levelText} callback={handleLevelStart} />
                <HomeButton value={"Level List"} callback={() => navigation.navigate({ name: 'Levels' })} />
                <HomeButton value={"Achievements"} callback={() => console.log('Achievments')} />
                <ThemeSwitch />
            </View>
        </View>
    );
}