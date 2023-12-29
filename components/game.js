import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkCompleted, insertCompletedWord, refreshLevel, updateBestScore, updateCompleted, updateScore } from '../data/database';
import { Keyboard } from './keyboard/Keyboard';
import { Gameboard } from './gameboard/Gameboard';
import { Scoreboard } from './scoreboard/Scoreboard';
import { GameHeader } from './GameHeader';
import { useGameContext } from './contexts/GameContext';
import { Popup } from './Popup';

// I have too many states in my opinion. I wonder if any can be changed.
export default function Game() {
    const {gameState, gameDispatch} = useGameContext();

    function onTilePress(index) {
        console.log(index);
        if (gameState.staticPosList.includes(index)) {
            console.log('STATIC POS!!!');
            return;
        }
        else {
            let newIndexStack = [...gameState.indexStack];
            let target = newIndexStack.indexOf(index);
            newIndexStack.splice(target, 1);
            gameDispatch({type: 'UPDATE_INDEX_STACK', payload: newIndexStack});
            let newWord = [...gameState.currentWord];
            newWord[index] = '';
            gameDispatch({type: 'SET_CURRENT_WORD', payload: newWord});
        }
        gameDispatch({type: 'UPDATE_VALID', payload: ''});

    }

    async function handleChangeLevel(newLevel) {
        if (newLevel > gameState.level) {
            const completed = await checkCompleted(newLevel - 1);
            if (!completed) {
                console.log(`Level ${gameState.level} is NOT completed, cannot proceed to ${newLevel}`);
                return; // level hasn't even been completed... this is really logic for debouncing
            }
            console.log('COMPELTED:', completed);
        }
        if(newLevel === 0) {
            return; // newLevel can't be 0
        }
        gameDispatch({type: 'CHANGE_LEVEL', payload: newLevel});
        AsyncStorage.setItem('level', String(newLevel));

    }

    // for dev & testing purposes
    async function handleLevelRefresh() {
        await refreshLevel(level);
    }
    
    return (
        <>
        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <GameHeader level={gameState.level} handleChangeLevel={handleChangeLevel} completed={gameState.completed} handleLevelRefresh={handleLevelRefresh} />
            <Scoreboard />
            <Gameboard currentWord={gameState.currentWord} valid={gameState.valid} onTilePress={onTilePress} staticPosList={gameState.staticPosList} />
            <Keyboard />

        </View>
        {
            gameState.popup ? <Popup type={'normal'} /> : <></>
        }
        </>
    );
}
