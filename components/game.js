import { View } from 'react-native';
import { checkCompleted, insertCompletedWord, refreshLevel, updateBestScore, updateCompleted, updateScore } from '../data/database';
import { Keyboard } from './keyboard/Keyboard';
import { Gameboard } from './gameboard/Gameboard';
import { Scoreboard } from './scoreboard/Scoreboard';
import { GameHeader } from './GameHeader';
import { useGameContext } from './contexts/GameContext';
import { Popup } from './Popup';

// I have too many states in my opinion. I wonder if any can be changed.
export default function Game() {
    const { gameState, gameDispatch } = useGameContext();



    // for dev & testing purposes
    async function handleLevelRefresh() {
        await refreshLevel(level);
    }

    return (
        <>
            <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <GameHeader />
                <Scoreboard />
                <Gameboard />
                <Keyboard />
            </View>
            {
                gameState.popup ? <Popup type={'normal'} /> : <></>
            }
        </>
    );
}
