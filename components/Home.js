import { View, Text, TouchableHighlight } from 'react-native';
import { useGameContext } from './contexts/GameContext';
import { useEffect, useState } from 'react';
import { getNumLevels } from '../data/database';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeButton({ value, callback }) {
    return (
        <TouchableHighlight
            style={{
                height: 60,
                width: '70%',
                borderWidth: 3,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                margin: 8
            }}
            underlayColor={'#098287'}
            onPress={callback}
        >
            <Text style={{fontSize: 28}}>{value}</Text>
        </TouchableHighlight>
    );
}

export default function Home() {
    const [inProgressLevel, setInProgressLevel] = useState(0);
    const { gameState, gameDispatch } = useGameContext();
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
        <View style={{ flex: 1, width: '100%' }}>
            <View style={{ height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 64 }}>Qwortz</Text>
            </View>
            <View style={{ height: '100%', alignItems: 'center' }}>
                <HomeButton value={levelText} callback={handleLevelStart} />
                <HomeButton value={"Level List"} callback={() => navigation.navigate({ name: 'Levels' })} />
                <HomeButton value={"Achievements"} callback={() => console.log('Achievments')} />
            </View>
        </View>
    );
}