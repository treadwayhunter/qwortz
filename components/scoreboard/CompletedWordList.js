import { View, Text, FlatList } from 'react-native';
import { useThemeContext } from '../contexts/ThemeContext';
import { useGameContext } from '../contexts/GameContext';

function WordBox({word}) {
    const { theme, setTheme } = useThemeContext();

    let size = 24;

    switch(word.length) {
        case 4: size = 20; break;
        case 5: size = 18; break;
        case 6: size = 16; break;
    }

    return (
        <View style={{ width: '20%', height: 60, justifyContent: 'center' }}>
            <Text style={{fontSize: size, color: theme === 'light' ? '#000' : '#fff'}}>{word}</Text>
        </View>
    );
}

export function CompletedWordList() {
    const { gameState, gameDispatch } = useGameContext();

    return (
        <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
            <FlatList
                data={gameState.completedWordList}
                renderItem={({item}) => <WordBox word={item} />}
                keyExtractor={item => item}
                numColumns={5}
                style={{ width: '100%', padding: 10 }}
            />
        </View>
    );
}
