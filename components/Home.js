import { View, Text, TouchableHighlight, Switch } from 'react-native';
import { useGameContext } from './contexts/GameContext';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
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
                borderColor: theme === 'light' ? '#000' : '#fff'
            }}
            underlayColor={'#098287'}
            onPress={callback}
        >
            <Text style={{ fontSize: 28, color: theme === 'light' ? '#000' : '#fff' }}>{value}</Text>
        </TouchableHighlight>
    );
}


/**
 * 
 * TODO
 */
export default function Home() {
    const { gameState, gameDispatch } = useGameContext();
    const { theme, setTheme } = useThemeContext();

    const navigation = useNavigation();
    console.log('HOME PROGRESS LEVEL: ', gameState.inProgressLevel);
    // needs to show the level in progress, not the current selected level...

    /**
     * handleLevelStart()
     * The level button on the homepage will always display the inProgressLevel
     * When this function is called, it changes the level to be the inProgressLevel
     *      Then it navigates to the game screen.
     */
    function handleLevelStart() {
        //AsyncStorage.setItem('level', String(gameState.inProgressLevel)); // so, this is correct... it might need fixing though
        gameDispatch({ type: 'CHANGE_LEVEL', payload: gameState.inProgressLevel });
        navigation.navigate({ name: 'Game' });
    }

    const levelText = `Level ${gameState.inProgressLevel}`;

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