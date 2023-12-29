import { View } from 'react-native';
import { Tile } from './Tile';
import { useThemeContext } from '../contexts/ThemeContext';

export function Gameboard({ currentWord, valid, onTilePress, staticPosList }) {

    const { theme, setTheme } = useThemeContext();
    
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
                currentWord.map((letter, index) => <Tile key={index} letter={letter} valid={valid} index={index} handlePress={onTilePress} locked={staticPosList.includes(index)} />)
            }
        </View>
    );
}
