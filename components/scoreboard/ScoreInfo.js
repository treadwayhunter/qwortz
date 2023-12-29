import { View, Text } from 'react-native';
import { useThemeContext } from '../contexts/ThemeContext';
import { useGameContext } from '../contexts/GameContext';

export function ScoreInfo() {
    const { theme, setTheme } = useThemeContext();
    const { gameState, gameDispatch } = useGameContext();

    return (
        <View style={{ height: 80, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
            <View style={{ height: '100%', width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24, color: theme === 'light' ? '#000' : '#fff' }}>Best</Text>
                <Text style={{ fontSize: 24, color: theme === 'light' ? '#000' : '#fff' }}>{gameState.bestScore}</Text>
            </View>
            <View style={{ height: '100%', width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24, color: theme === 'light' ? '#000' : '#fff' }}>Pass</Text>
                <Text style={{ fontSize: 24, color: theme === 'light' ? '#000' : '#fff' }}>{gameState.minScore}</Text>
            </View>
        </View>
    );
}
