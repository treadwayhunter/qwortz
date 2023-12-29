import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeContext } from './contexts/ThemeContext';
import { useGameContext } from './contexts/GameContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkCompleted } from '../data/database';


// creates an overlay that technically covers the whole screen. All buttons beneath are untouchable
export function Popup({ type }) {
    const { theme, setTheme } = useThemeContext();
    const { gameState, gameDispatch } = useGameContext();
    // type can be normal or pro
    //console.log('TYPE:' , type);
    if (type !== 'normal' && type !== 'pro') {
        throw new Error(`Popup must be "normal" or "pro". Value == ${type}`);
    }

    async function handleNextLevel() {
        const completed = await checkCompleted(gameState.level); // debounces
        if(completed) {
            gameDispatch({type: 'CHANGE_LEVEL', payload: gameState.level + 1 });
            AsyncStorage.setItem('level', String(gameState.level + 1));
        }
        else {
            console.log(`Level ${gameState.level} is NOT completed, cannot proceed to ${gameState.level + 1}`);
        }
    }

    // The popup should probably be animated when it appears. It waits 1/2 a second to show up, but it could at least look nice in doing so
    return (
        <View style={{ flex: 1, height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute'}}>
            <View style={{
                height: 200,
                width: 200,
                backgroundColor: theme === 'light' ? '#fff' : '#2c2c2c',
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                shadowColor: '#000',
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 8,
                pointerEvents: 'auto'
            }}>
                <View style={{ width: '100%', height: '40%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: theme === 'light' ? '#000' : '#fff', fontSize: 32 }}>Great Work!</Text>
                </View>
                <TouchableOpacity style={{ width: '100%', height: '20%', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}
                    onPress={handleNextLevel}
                >
                    <Text style={{ color: theme === 'light' ? '#000' : '#fff' }}>Next Level</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '100%', height: '20%', alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => gameDispatch({type: 'HIDE_POPUP'})}
                >
                    <Text style={{ color: theme === 'light' ? '#000' : '#fff' }}>Stay on this level</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}