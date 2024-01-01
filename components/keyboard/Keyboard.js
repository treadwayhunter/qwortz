import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Key } from './Key';
import { BackSpace } from './BackSpace';
import { useGameContext } from '../contexts/GameContext';
import dictionary from '../../assets/dictionary.json';
import { checkCompleted, insertCompletedWord, refreshLevel, updateBestScore, updateCompleted, updateScore } from '../../data/database';
import { useThemeContext } from '../contexts/ThemeContext';
import validateWord from '../../utils/ValidateWord';
import checkWordArray from '../../utils/CheckWordArray';

export function Keyboard() {
    const { gameState, gameDispatch } = useGameContext();
    const { theme, setTheme } = useThemeContext();

    useEffect(() => {
        checkWord(gameState.defaultWord);
    }, []);

    function handlePress(letter) {
        addLetter(letter);
    }

    function addLetter(letter) {
        cursor = 0;
        let newWord = gameState.currentWord;
        while (newWord[cursor]) {
            cursor++;
        }
        if (cursor >= newWord.length) {
            // then every letter is good, so do nothing
            return;
        }

        newWord[cursor] = letter;
        gameDispatch({ type: 'SET_CURRENT_WORD', payload: newWord });
        addIndexStack(cursor);
        checkWord(newWord);
    }

    function checkWord(newWord) {
        let word = checkWordArray(newWord);

        if (word) {
            if (gameState.completedWordList.includes(word)) {
                // the word exists in the completed word list, so nothing else needs to occur
                gameDispatch({ type: 'UPDATE_VALID', payload: 'used' });
            }
            else {
                if (validateWord(word)) {
                    gameDispatch({ type: 'UPDATE_VALID', payload: 'good' });
                    setTimeout(() => {
                        incScore();
                        addCompletedWord(word);
                        resetGameBoard();
                    }, 500);
                }
                else {
                    gameDispatch({ type: 'UPDATE_VALID', payload: 'bad' });
                }
            }
        }
    }


    function addIndexStack(index) {
        let newIndexStack = [...gameState.indexStack, index];
        newIndexStack.sort();
        //setIndexStack(newIndexStack);
        gameDispatch({ type: 'UPDATE_INDEX_STACK', payload: newIndexStack });
    }

    function incScore() {
        let points = gameState.score + 1;
        //setScore(points);
        gameDispatch({ type: 'SET_SCORE', payload: points });
        updateScore(gameState.level);
        if (points > gameState.bestScore) {
            //setBestScore(points);
            gameDispatch({ type: 'SET_BEST_SCORE', payload: points });
            updateBestScore(gameState.level);
        }
        if (points === gameState.minScore) { // this will only occur once
            updateCompleted(gameState.level); // SQL call
            //setCompleted(true);
            gameDispatch({ type: 'SET_COMPLETED', payload: true }); // game call
            // when this occurs for the first time
            // make the popup show up?
            setTimeout(() => {
                gameDispatch({ type: 'SHOW_POPUP' });
            }, 500);
        }
        // if points === gameState.proScore
    }

    function resetGameBoard() {
        const resetWord = [...gameState.defaultWord];
        gameDispatch({ type: 'SET_CURRENT_WORD', payload: resetWord });
        gameDispatch({ type: 'UPDATE_VALID', payload: '' });
        gameDispatch({ type: 'UPDATE_INDEX_STACK', payload: [] });
    }


    // function adds the completed word to memory and database
    function addCompletedWord(word) {
        let newWordList = [word, ...gameState.completedWordList]; // creates a new word list with the new word at the front
        gameDispatch({ type: 'UPDATE_COMPLETED_LIST', payload: newWordList });
        insertCompletedWord(gameState.level, word); // add to wordlist in persistent database
    }

    function backspace() {
        if (gameState.valid !== 'good') { // disables the backspace when valid is true for the split second it is
            if (gameState.indexStack.length > 0) {
                let newIndexStack = [...gameState.indexStack];
                const index = newIndexStack.pop();

                let newWord = [...gameState.currentWord];
                newWord[index] = '';
                gameDispatch({ type: 'SET_CURRENT_WORD', payload: newWord });
                gameDispatch({ type: 'UPDATE_INDEX_STACK', payload: newIndexStack });
            }
            gameDispatch({ type: 'UPDATE_VALID', payload: '' });
        }
    }

    return (
        <View
            aria-label='keyboard'
            style={{
                width: '100%',
                backgroundColor: theme === 'light' ? '#094387' : '#2c2c2c',
                alignItems: 'center',
                marginTop: 'auto',
                paddingBottom: 30,
                paddingTop: 20
            }}
        >
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <Key letter='Q' onPress={handlePress} />
                <Key letter='W' onPress={handlePress} />
                <Key letter='E' onPress={handlePress} />
                <Key letter='R' onPress={handlePress} />
                <Key letter='T' onPress={handlePress} />
                <Key letter='Y' onPress={handlePress} />
                <Key letter='U' onPress={handlePress} />
                <Key letter='I' onPress={handlePress} />
                <Key letter='O' onPress={handlePress} />
                <Key letter='P' onPress={handlePress} />
            </View>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <Key letter='A' onPress={handlePress} />
                <Key letter='S' onPress={handlePress} />
                <Key letter='D' onPress={handlePress} />
                <Key letter='F' onPress={handlePress} />
                <Key letter='G' onPress={handlePress} />
                <Key letter='H' onPress={handlePress} />
                <Key letter='J' onPress={handlePress} />
                <Key letter='K' onPress={handlePress} />
                <Key letter='L' onPress={handlePress} />
            </View>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <Key letter='Z' onPress={handlePress} />
                <Key letter='X' onPress={handlePress} />
                <Key letter='C' onPress={handlePress} />
                <Key letter='V' onPress={handlePress} />
                <Key letter='B' onPress={handlePress} />
                <Key letter='N' onPress={handlePress} />
                <Key letter='M' onPress={handlePress} />
                <View>
                    <BackSpace onPress={backspace} />
                </View>
            </View>
        </View>
    );
}