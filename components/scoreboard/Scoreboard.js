import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { View, Text } from 'react-native';
import { ProgressBar } from './ProgressBar';
import { useThemeContext } from '../contexts/ThemeContext';
import { CompletedWordList } from './CompletedWordList';
import { useGameContext } from '../contexts/GameContext';
import { ScoreInfo } from './ScoreInfo';
// best score, min score, score, completedWordList
export function Scoreboard() {
    const { theme, setTheme } = useThemeContext();
    const { gameState, gameDispatch } = useGameContext();

    return (
        <View aria-label='scoreboard' style={{ flex: 1, width: '100%', alignItems: 'center', backgroundColor: theme === 'light' ? '#fff' : '#121212' }}>
            <ScoreInfo />
            <ProgressBar />
            <View style={{ flex: 0.25, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                {gameState.bestScore >= gameState.minScore
                    ? <View style={{ borderWidth: 3, borderColor: 'green', borderRadius: 100, height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}><FontAwesomeIcon color='green' size={24} icon={faCheck} /></View>
                    : <></>}
            </View>
            <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 40, color: theme === 'light' ? '#000' : '#fff' }}>{gameState.score}</Text>
            </View>
            <CompletedWordList />
        </View>
    );
}