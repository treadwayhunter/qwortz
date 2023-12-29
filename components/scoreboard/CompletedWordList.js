import { View, Text, FlatList } from 'react-native';
import { useThemeContext } from '../contexts/ThemeContext';
import { useGameContext } from '../contexts/GameContext';

export function CompletedWordList() {
    const { gameState, gameDispatch } = useGameContext();
    const { theme, setTheme } = useThemeContext();

    return (
        <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
            <FlatList
                data={gameState.completedWordList}
                renderItem={({ item }) => <View style={{ margin: 8 }}><Text style={{ fontSize: 24, color: theme === 'light' ? '#000' : '#fff' }}>{item}</Text></View>}
                keyExtractor={item => item}
                numColumns={5}
                style={{ width: '100%' }}
                contentContainerStyle={{ alignItems: 'center' }} />
        </View>
    );
}
