import { useEffect, useState } from 'react';
import { View } from 'react-native';
import dictionary from '../assets/dictionary.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkCompleted, getCompletedWords, getLevelData, insertCompletedWord, refreshLevel, updateBestScore, updateCompleted, updateScore } from '../data/database';
import { Keyboard } from './Keyboard';
import { Gameboard } from './Gameboard';
import { Scoreboard } from './Scoreboard';
import { GameHeader } from './GameHeader';

// I have too many states in my opinion. I wonder if any can be changed.
export default function Game() {
    const [color, setColor] = useState('#094387');
    const [level, setLevel] = useState(0); // valid levels will be greater than 0
    const [defaultWord, setDefaultWord] = useState([]); // good for helping reset the current word when needed
    const [currentWord, setCurrentWord] = useState(defaultWord); // will set to whatever the default word is
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [minScore, setMinScore] = useState(1);
    const [completedWordList, setCompletedWordList] = useState([]);
    const [staticPosList, setStaticPosList] = useState([]);
    const [indexStack, setIndexStack] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [valid, setValid] = useState(''); // if valid is true, the tiles turn green?
    // to improve the game load times, I could preload the previous and next levels. They could be stored as objects, then split into the various states when loaded. Moving from memory to the game is much faster than an I/O op.

    //console.log('COMPLETED TOP: ', completed);

    useEffect(() => {
        console.log('Use Effect called for the one and only time');
        if (!level) {
            try {
                AsyncStorage.getItem('level')
                    .then((value) => {
                        if (!value) {
                            // value doesn't exist or is 0 for some reason
                            AsyncStorage.setItem('level', '1');
                            setLevel(1);
                            getLevel(1); // I think this is where it's dying
                        }
                        else {
                            /*console.log('VALUE:::', value);
                            AsyncStorage.setItem('level', '1');*/
                            setLevel(Number(value)); // when the new level is selected by any method, AsyncStorage.setItem('level', num);
                            getLevel(value);
                        }
                    });
            }

            catch (error) {
                // Error getting item
                // What happens if the AsyncStorage call fails?
                // 1) Data fetching errors
                // 2) Storage limits
                // 3) JSON parsing errors
                // 4) Platform-specific issues
                // 5) Concurrency and timing issues
                // 6) OUtdated or incompatible version of AsyncStorage
            }
        }
        else {
            // getLevelData for this level
            getLevel(level); // this might be slowing it down in some cases
        }
    }, /*[level]*/[]);



    function getLevel(level) {
        console.log('GET LEVEL CALLED: ', level);
        getLevelData(level)
            .then((data) => {
                //console.log('DATA', data);
                // create a new array with data.length, each index = ''
                // fill the new array with the correct positions
                // set this new array as the default array
                // set the score, bestscore, and minscore states
                let newDefault = [];
                let staticPosArr = [];
                for (let i = 0; i < data.length; i++) {
                    newDefault.push('');
                }
                if (data.letter1 && data.letter1_pos || data.letter1_pos === 0) {
                    //console.log('letter 1 and pos');
                    newDefault[data.letter1_pos] = data.letter1;
                    staticPosArr.push(data.letter1_pos);
                }
                if (data.letter2 && data.letter2_pos || data.letter2_pos === 0) {
                    //console.log('letter 2 and pos');
                    newDefault[data.letter2_pos] = data.letter2;
                    staticPosArr.push(data.letter2_pos);
                }
                if (data.letter3 && data.letter3_pos || data.letter3_pos === 0) {
                    //console.log('letter 3 and pos');
                    newDefault[data.letter3_pos] = data.letter3;
                    staticPosArr.push(data.letter3_pos);

                }
                //console.log(newDefault);
                setDefaultWord(newDefault);
                setCurrentWord(newDefault);
                setScore(data.score);
                setBestScore(data.best_score);
                setMinScore(data.min_score);
                setStaticPosList(staticPosArr);
                setCompleted(data.completed);
            });
        getCompletedWords(level)
            .then((list) => {
                if (list) {
                    console.log('Completed:', list);
                    setCompletedWordList(list);
                }
            });
    }

    function handlePress(letter) {
        //console.log('Press', letter);
        addLetter(letter);
    }

    function addLetter(letter) {
        cursor = 0;
        let newWord = [...currentWord];
        while (newWord[cursor]) {
            cursor++;
        }

        if (cursor >= newWord.length) {
            //console.log('gone over size');
            return; // we've gone over the length, so no need to do anything.. for protection
        }

        newWord[cursor] = letter;
        setCurrentWord(newWord);
        addIndexStack(cursor);
        checkWord(newWord);

    }

    function addIndexStack(index) {
        let newIndexStack = [...indexStack, index];
        newIndexStack.sort();
        setIndexStack(newIndexStack);
    }

    function checkWord(newWord) {
        for (let i = 0; i < newWord.length; i++) {
            if (newWord[i] === '') {
                return; // no need to continue the function if there is a blank space
            }
        }

        let word = newWord.join('');
        validateWord(word);
    }


    function validateWord(word) {
        if (completedWordList.includes(word)) {
            //console.log('Word exists in list... bad');
            setValid('used');
            return; // word 
        }
        if (dictionary[word]) {
            //console.log('VALID WORD');
            setValid('good');
            setTimeout(() => {
                incScore();
                addCompletedWord(word);
                reset();
            }, 500);
        }
        else {
            setValid('bad');
        }
    }

    // increments the score, makes appropriate changes to best score
    // should also message SQL about new scores
    function incScore() {
        let points = score + 1;
        setScore(points);
        updateScore(level);
        if (points > bestScore) {
            setBestScore(points);
            updateBestScore(level);
        }
        if (points >= minScore) {
            updateCompleted(level);
            setCompleted(true);
        }
    }

    function reset() {
        setCurrentWord(defaultWord);
        setValid('');
        setIndexStack([]);
    }


    // function adds the completed word to memory and database
    function addCompletedWord(word) {
        let newWordList = [word, ...completedWordList];
        setCompletedWordList(newWordList); // add to wordlist in memory
        insertCompletedWord(level, word); // add to wordlist in persistent database
    }

    function backspace() {
        if (valid !== 'good') { // disables the backspace when valid is true for the split second it is
            if (indexStack.length > 0) {
                //console.log('backspace');
                let newIndexStack = [...indexStack];
                const index = newIndexStack.pop();

                let newWord = [...currentWord];
                newWord[index] = '';
                setCurrentWord(newWord);
                setIndexStack(newIndexStack);
            }
            setValid('');
        }
    }

    function onTilePress(index) {
        console.log(index);
        if (staticPosList.includes(index)) {
            console.log('STATIC POS!!!');
            return;
        }
        else {
            let newIndexStack = [...indexStack];
            //console.log(newIndexStack);
            //console.log('Index stack:', newIndexStack.indexOf(index));
            let target = newIndexStack.indexOf(index);
            newIndexStack.splice(target, 1);
            //console.log(newIndexStack);
            setIndexStack(newIndexStack);

            let newWord = [...currentWord];
            newWord[index] = '';
            setCurrentWord(newWord);
        }
        setValid('');
    }

    async function handleChangeLevel(newLevel) {
        // debouncing could be stopped if I explicitly track which levels have been completed or not
        //console.log('check level', 2);
        console.log('-----------');
        if (newLevel > level) {
            const completed = await checkCompleted(newLevel - 1);
            if (!completed) {
                console.log(`Level ${level} is NOT completed, cannot proceed to ${newLevel}`);
                return; // level hasn't even been completed... this is really logic for debouncing
            }
            console.log('COMPLETED:', completed);
        }
        if (newLevel === 0) {
            return; // newLevel can't be 0
        }
        //console.log('check completed... is it the correct order?');
        setLevel(newLevel);
        getLevel(newLevel);

        AsyncStorage.setItem('level', String(newLevel));
        console.log('-----------');

    }

    // for dev & testing purposes
    async function handleLevelRefresh() {
        await refreshLevel(level);
        getLevel(level);
    }
    
    return (
        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
            <GameHeader level={level} handleChangeLevel={handleChangeLevel} completed={completed} handleLevelRefresh={handleLevelRefresh} />
            <Scoreboard score={score} bestScore={bestScore} minScore={minScore} completedWordList={completedWordList} />
            <Gameboard currentWord={currentWord} valid={valid} onTilePress={onTilePress} staticPosList={staticPosList} />
            <Keyboard handlePress={handlePress} backspace={backspace} />
        </View>
    );
}