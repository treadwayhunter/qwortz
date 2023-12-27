import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, createContext,useState, useReducer, useEffect } from "react";
import { getCompletedWords, getLevelData } from "../../data/database";

const GameContext = createContext();

const initialState = {
    level: 0, // the level the user is CURRENTLY on
    progressLevel: 1, // the max level the user is currently progressing
    defaultWord: [],
    currentWord: [],
    score: 0,
    bestScore: 0,
    minScore: 1,
    completedWordList: [],
    staticPosList: [],
    indexStack: [],
    completed: false,
    valid: ''
};

function reducer(state, action) {
    switch(action.type) {
        case 'CHANGE_LEVEL': return {...state, level: action.payload};
        case 'SET_DEFAULT_WORD': return {...state, defaultWord: action.payload};
        case 'SET_CURRENT_WORD': return {...state, currentWord: action.payload};
        case 'SET_SCORE': return {...state, score: action.payload};
        case 'SET_BEST_SCORE': return {...state, bestScore: action.payload};
        case 'SET_MIN_SCORE': return {...state, minScore: action.payload};
        case 'UPDATE_COMPLETED_LIST': return {...state, completedWordList: action.payload};
        case 'SET_STATIC_POS_LIST': return{...state, staticPosList: action.payload};
        case 'UPDATE_INDEX_STACK': return {...state, indexStack: action.payload};
        case 'SET_COMPLETED': return {...state, completed: action.payload};
        case 'UPDATE_VALID': return {...state, valid: action.payload};
    }
}


export function GameContextProvider({children}) {

    const [gameState, gameDispatch] = useReducer(reducer, initialState);
    
    useEffect(() => {
        console.log('-------------');
        console.log('Level Changed');
        initLevel();
    }, [gameState.level]);

    function initLevel() {
        console.log('[GameContext.js] initLevel()');
        if (!gameState.level) {
            try {
                AsyncStorage.getItem('level')
                    .then((value) => {
                        if (!value) {
                            AsyncStorage.setItem('level', '1');
                            gameDispatch({ type: 'CHANGE_LEVEL', payload: 1 });
                            getLevel(1);

                            // There was a situation in which level = NaN, which breaks the game
                        }
                        else {
                            gameDispatch({ type: 'CHANGE_LEVEL', payload: Number(value) });
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
            AsyncStorage.getItem('level')
                .then((value) => {
                    gameDispatch({ type: 'CHANGE_LEVEL', payload: Number(value) });
                    getLevel(value);
                });
        }
    }

    function getLevel(level) {
        //console.log('[GameContext.js] getLevel() called for level: ', level);
        console.log('[GameContext.js] getting level: ', level);
        getLevelData(level)
            .then((data) => {
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
                
                let newCurrent = [...newDefault]; // ensures that default and current don't share the same reference

                // these dispatches might do better if put under one larger dispatch
                gameDispatch({type: 'SET_DEFAULT_WORD', payload: newDefault});
                gameDispatch({type: 'SET_CURRENT_WORD', payload: newCurrent});
                gameDispatch({type: 'SET_SCORE', payload: data.score});
                gameDispatch({type: 'SET_BEST_SCORE', payload: data.best_score});
                gameDispatch({type: 'SET_MIN_SCORE', payload: data.min_score});
                gameDispatch({type: 'SET_STATIC_POS_LIST', payload: staticPosArr});
                gameDispatch({type: 'SET_COMPLETED', payload: data.completed});

            });
        getCompletedWords(level)
            .then((list) => {
                if (list) {
                    console.log('[GameContext.js] getCompletedWords() called');
                    gameDispatch({type: 'UPDATE_COMPLETED_LIST', payload: list});
                }
            });
    }

    return (
        <GameContext.Provider value={{gameState, gameDispatch}}>
            {children}
        </GameContext.Provider>
    );
}

export function useGameContext() {
    const context = useContext(GameContext);
    if(!context) {
        throw new Error('Game context must be used within a GameContextProvider');
    }
    return context;
}