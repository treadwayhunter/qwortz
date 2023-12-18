import { faArrowLeft, faArrowRight, faCheck, faArrowsRotate, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dictionary from '../assets/dictionary.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dropTables, getCompletedWords, getLevelData, initdb, insertCompletedWord, printTabledata, refreshLevel, updateBestScore, updateScore } from '../data/database';
import { Tile } from './Tile';
import { Key } from './Key';
import { BackSpace } from './BackSpace';
import { useNavigation } from '@react-navigation/native';

export default function Game() {
    const insets = useSafeAreaInsets();
    //const [dbReady, setDBReady] = useState(false); // a flag for making sure the database is ready before calling from it
    const [color, setColor] = useState('#094387');
    const [level, setLevel] = useState(0); // valid levels will be greater than 0
    const [defaultWord, setDefaultWord] = useState([]); // good for helping reset the current word when needed
    const [currentWord, setCurrentWord] = useState(defaultWord); // will set to whatever the default word is
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [minScore, setMinScore] = useState(1);
    const [completedWordList, setCompletedWordList] = useState([]);
    const [indexStack, setIndexStack] = useState([]);
    const [valid, setValid] = useState(''); // if valid is true, the tiles turn green?
    const [error, setError] = useState('');

    const navigation = useNavigation();

    
    useEffect(() => {
        if (!level) {
            try {
                AsyncStorage.getItem('level')
                    .then((value) => {
                        if (!value) {
                            // value doesn't exist or is 0 for some reason
                            AsyncStorage.setItem('level', '1');
                            setLevel(1);
                        }
                        else {
                            setLevel(Number(value)); // when the new level is selected by any method, AsyncStorage.setItem('level', num);
                            getLevel(value);
                        }
                    });
            }

            catch (error) {
                // Error getting item
            }
        }
        else {
            // getLevelData for this level
            getLevel(level); // this might be slowing it down in some cases
        }
    }, /*[level]*/ []);
    


    function getLevel(level) {
        getLevelData(level)
            .then((data) => {
                //console.log('DATA', data);
                // create a new array with data.length, each index = ''
                // fill the new array with the correct positions
                // set this new array as the default array
                // set the score, bestscore, and minscore states
                let newDefault = [];
                for (let i = 0; i < data.length; i++) {
                    newDefault.push('');
                }
                if (data.letter1 && data.letter1_pos || data.letter1_pos === 0) {
                    //console.log('letter 1 and pos');
                    newDefault[data.letter1_pos] = data.letter1;
                }
                if (data.letter2 && data.letter2_pos || data.letter2_pos === 0) {
                    //console.log('letter 2 and pos');
                    newDefault[data.letter2_pos] = data.letter2;
                }
                if (data.letter3 && data.letter3_pos || data.letter3_pos === 0) {
                    //console.log('letter 3 and pos');
                    newDefault[data.letter3_pos] = data.letter3;
                }
                //console.log(newDefault);
                setDefaultWord(newDefault);
                setCurrentWord(newDefault);
                setScore(data.score);
                setBestScore(data.best_score);
                setMinScore(data.min_score);
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
        //console.log(newWord);
        setCurrentWord(newWord);
        addIndexStack(cursor);

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
            setValid('bad');
            setError('Cannot use same word twice!');
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
            //console.log('BAD');
            setValid('bad'); // when backspace occurs, it's no longer 'bad', so do that in the backspace function
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
    }

    function reset() {
        setCurrentWord(defaultWord);
        setValid('');
        setIndexStack([]);
        setError('');
    }

    function addIndexStack(index) {
        let newIndexStack = [...indexStack, index];
        setIndexStack(newIndexStack);
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

    function handleChangeLevel(level) {

        setLevel(level);
        getLevel(level);
        AsyncStorage.setItem('level', String(level));
      
        setDebounce(false);
    }   

    // for dev & testing purposes
    async function handleLevelRefresh() {
        await refreshLevel(level);
        getLevel(level);
    }

    return (
        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>

            <View aria-label='infoboard' style={{ width: '100%', paddingTop: insets.top, height: 80 + insets.top, backgroundColor: color, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <TouchableOpacity onPress={() => handleChangeLevel(level - 1)}>
                    {
                        level <= 1
                            ? <></>
                            : <FontAwesomeIcon color={'white'} size={32} icon={faArrowLeft} />
                    }
                </TouchableOpacity>
                <Text style={{ fontSize: 32, color: 'white' }}>Level: {level}</Text>
                <TouchableOpacity onPress={() => handleChangeLevel(level + 1)}>
                    {
                        bestScore >= minScore
                            ? <FontAwesomeIcon color={'white'} size={32} icon={faArrowRight} />
                            : <></>
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => await handleLevelRefresh()}>
                    <FontAwesomeIcon color={'white'} size={32} icon={faArrowsRotate} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate({name: 'Settings'})}>
                    <FontAwesomeIcon color={'white'} size={32} icon={faGear} />
                </TouchableOpacity>
            </View>

            <View aria-label='scoreboard' style={{ flex: 1, width: '100%' }}>
                <View style={{ height: 80, width: '100%', flexDirection: 'row', paddingLeft: 20, paddingRight: 20, alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <View>
                        <Text style={{ fontSize: 24 }}>Best Score: {bestScore}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 24 }}>Min Score: {minScore}</Text>
                    </View>
                </View>
                <View style={{ flex: 0.25, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    {
                        bestScore >= minScore
                            ? <View style={{ borderWidth: 3, borderColor: 'green', borderRadius: 100, height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}><FontAwesomeIcon color='green' size={24} icon={faCheck} /></View>
                            : <></>
                    }
                </View>
                <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 40 }}>{score}</Text>
                </View>
                <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                    <FlatList
                        data={completedWordList}
                        renderItem={({ item }) => <View style={{ margin: 8 }}><Text style={{ fontSize: 24 }}>{item}</Text></View>}
                        keyExtractor={item => item}
                        numColumns={2}
                        style={{width: '100%'}}
                        contentContainerStyle={{alignItems: 'center'}}
                    />
                </View>
            </View>

            <View aria-label='gameboard' style={{ flex: 0.10, width: '100%', justifyContent: 'center', flexDirection: 'row', padding: 20 }}>
                {
                    currentWord.map((letter, index) =>
                        <Tile key={index} letter={letter} valid={valid} />
                    )
                }
            </View>

            <View aria-label='errorboard' style={{ flex: 0.25, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                {
                    valid === 'bad'
                        ? <Text style={{ fontSize: 20 }}>{error}</Text>
                        : <></>
                }
            </View>

            <View aria-label='keyboard' style={{ width: '100%', backgroundColor: color, alignItems: 'center', marginTop: 'auto', paddingBottom: 30, paddingTop: 20 }}>
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
        </View>
    );
}