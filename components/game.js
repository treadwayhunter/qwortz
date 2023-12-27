import { useEffect, useState } from 'react';
import { View } from 'react-native';
import dictionary from '../assets/dictionary.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkCompleted, insertCompletedWord, refreshLevel, updateBestScore, updateCompleted, updateScore } from '../data/database';
import { Keyboard } from './keyboard/Keyboard';
import { Gameboard } from './gameboard/Gameboard';
import { Scoreboard } from './scoreboard/Scoreboard';
import { GameHeader } from './GameHeader';
import { useGameContext } from './contexts/GameContext';

// I have too many states in my opinion. I wonder if any can be changed.
export default function Game() {
    const [color, setColor] = useState('#094387');
    const {gameState, gameDispatch} = useGameContext();

    // if for some reason the VALID colors didn't auto clear, this should force it to do so


    function onTilePress(index) {
        console.log(index);
        if (gameState.staticPosList.includes(index)) {
            console.log('STATIC POS!!!');
            return;
        }
        else {
            let newIndexStack = [...gameState.indexStack];
            //console.log(newIndexStack);
            //console.log('Index stack:', newIndexStack.indexOf(index));
            let target = newIndexStack.indexOf(index);
            newIndexStack.splice(target, 1);
            //console.log(newIndexStack);
            //setIndexStack(newIndexStack);
            gameDispatch({type: 'UPDATE_INDEX_STACK', payload: newIndexStack});

            let newWord = [...gameState.currentWord];
            newWord[index] = '';
            //setCurrentWord(newWord);
            gameDispatch({type: 'SET_CURRENT_WORD', payload: newWord});
        }
        //setValid('');
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
        // getLevel(level); how do I force the context to refresh?
    }
    
    return (
        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
            <GameHeader level={gameState.level} handleChangeLevel={handleChangeLevel} completed={gameState.completed} handleLevelRefresh={handleLevelRefresh} />
            <Scoreboard score={gameState.score} bestScore={gameState.bestScore} minScore={gameState.minScore} completedWordList={gameState.completedWordList} />
            <Gameboard currentWord={gameState.currentWord} valid={gameState.valid} onTilePress={onTilePress} staticPosList={gameState.staticPosList} />
            <Keyboard />
        </View>
    );
}