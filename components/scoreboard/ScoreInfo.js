import { View, Text } from 'react-native';
import { useThemeContext } from '../contexts/ThemeContext';
import { useGameContext } from '../contexts/GameContext';

export function ScoreInfo() {
    const { theme, setTheme } = useThemeContext();
    const { gameState, gameDispatch } = useGameContext();

    const fSize = 18;

    return (
        <View style={{ height: 80, width: '100%', justifyContent: 'center', paddingLeft: 40 }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: fSize, color: theme === 'light' ? '#000' : '#fff' }}>Best: </Text>
                <Text style={{ fontSize: fSize, color: theme === 'light' ? '#000' : '#fff' }}>{gameState.bestScore}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: fSize, color: theme === 'light' ? '#000' : '#fff' }}>Pass: </Text>
                <Text style={{ fontSize: fSize, color: theme === 'light' ? '#000' : '#fff' }}>{gameState.minScore}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: fSize, color: theme === 'light' ? '#000' : '#fff' }}>Pro: </Text>
                <Text style={{ fontSize: fSize, color: theme === 'light' ? '#000' : '#fff' }}>{gameState.proScore}</Text>
            </View>
        </View>
    );
}
