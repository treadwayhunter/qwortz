import { useContext, createContext, useState, useReducer, useEffect } from "react";
import { getCompletedWords, getLevelData, getNumLevels } from "../../data/database";

const GameContext = createContext();

const initialState = {
    level: 0, // the level the user is CURRENTLY on
    inProgressLevel: 1, // the max level the user is currently progressing
    defaultWord: [],
    currentWord: [],
    score: 0,
    bestScore: 0,
    minScore: 1,
    proScore: 0,
    completedWordList: [],
    staticPosList: [],
    indexStack: [],
    completed: false,
    valid: '',
    popup: false // this is to track whether the popup should be displayed or not.
};

function reducer(state, action) {
    switch (action.type) {
        case 'CHANGE_LEVEL': return { ...state, level: action.payload };
        case 'SET_DEFAULT_WORD': return { ...state, defaultWord: action.payload };
        case 'SET_CURRENT_WORD': return { ...state, currentWord: action.payload };
        case 'SET_SCORE': return { ...state, score: action.payload };
        case 'SET_BEST_SCORE': return { ...state, bestScore: action.payload };
        case 'SET_MIN_SCORE': return { ...state, minScore: action.payload };
        case 'SET_PRO_SCORE': return { ...state, proScore: action.payload };
        case 'UPDATE_COMPLETED_LIST': return { ...state, completedWordList: action.payload };
        case 'SET_STATIC_POS_LIST': return { ...state, staticPosList: action.payload };
        case 'UPDATE_INDEX_STACK': return { ...state, indexStack: action.payload };
        case 'SET_COMPLETED': return { ...state, completed: action.payload }; // set completed should also increment the progressLevel
        case 'UPDATE_VALID': return { ...state, valid: action.payload };
        case 'SHOW_POPUP': return { ...state, popup: true };
        case 'HIDE_POPUP': return { ...state, popup: false };
        case 'LEVEL_SETUP': return {
            ...state,
            level: action.payload.level,
            defaultWord: action.payload.defaultWord,
            currentWord: action.payload.currentWord,
            score: action.payload.score,
            bestScore: action.payload.bestScore,
            minScore: action.payload.minScore,
            proScore: action.payload.proScore,
            staticPosList: action.payload.staticPosList,
            completed: action.payload.completed,
            popup: false
        }
        case 'INPROGRESS_LEVEL': return { ...state, inProgressLevel: action.payload };
    }
}


export function GameContextProvider({ children }) {

    const [gameState, gameDispatch] = useReducer(reducer, initialState);

    // This gets called when gameState.level changes
    useEffect(() => {
        getNumLevels()
            .then((value) => {
                const targetLevel = value + 1;
                gameDispatch({ type: 'INPROGRESS_LEVEL', payload: targetLevel });
            });
    }, []);

    useEffect(() => {
        if (gameState.level) {
            console.log('-------------');
            console.log('Level Changed');
            //initLevelData();
            getLevel(gameState.level);
        }
    }, [gameState.level]);

    function getLevel(currentLevel) {
        //console.log('[GameContext.js] getLevel() called for level: ', level);
        console.log('[GameContext.js] getting level: ', currentLevel);
        getLevelData(currentLevel)
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

                const payload = {
                    level: currentLevel,
                    defaultWord: newDefault,
                    currentWord: newCurrent,
                    score: data.score,
                    bestScore: data.best_score,
                    minScore: data.min_score,
                    proScore: data.pro_score,
                    staticPosList: staticPosArr,
                    completed: data.completed
                }

                // a single dispatch makes it much faster, and fixes a lot of nonsense
                gameDispatch({ type: 'LEVEL_SETUP', payload: payload });

            });
        getCompletedWords(currentLevel)
            .then((list) => {
                if (list) {
                    console.log('[GameContext.js] getCompletedWords() called');
                    gameDispatch({ type: 'UPDATE_COMPLETED_LIST', payload: list });
                }
            });
    }

    return (
        <GameContext.Provider value={{ gameState, gameDispatch }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGameContext() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('Game context must be used within a GameContextProvider');
    }
    return context;
}