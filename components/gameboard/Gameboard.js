import { View } from 'react-native';
import { Tile } from './Tile';
import { useThemeContext } from '../contexts/ThemeContext';
import { useGameContext } from '../contexts/GameContext';

export function Gameboard() {

    const { theme, setTheme } = useThemeContext();
    const { gameState, gameDispatch } = useGameContext();

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
            gameDispatch({ type: 'UPDATE_INDEX_STACK', payload: newIndexStack });
            let newWord = [...gameState.currentWord];
            newWord[index] = '';
            gameDispatch({ type: 'SET_CURRENT_WORD', payload: newWord });
        }
        gameDispatch({ type: 'UPDATE_VALID', payload: '' });

    }

    return (
        <View 
            aria-label='gameboard' 
            style={{ 
                flex: 0.1, 
                width: '100%', 
                justifyContent: 'center', 
                flexDirection: 'row', 
                padding: 20,
                backgroundColor: theme === 'light' ? '#fff' : '#121212'  
            }}
        >
            {
                gameState.currentWord.map((letter, index) => <Tile key={index} letter={letter} valid={gameState.valid} index={index} handlePress={onTilePress} locked={gameState.staticPosList.includes(index)} />)
            }
        </View>
    );
}
