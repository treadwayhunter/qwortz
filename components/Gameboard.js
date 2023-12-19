import { View } from 'react-native';
import { Tile } from './Tile';

export function Gameboard({ currentWord, valid, onTilePress }) {
    return (
        <View aria-label='gameboard' style={{ flex: 0.1, width: '100%', justifyContent: 'center', flexDirection: 'row', padding: 20 }}>
            {
                currentWord.map((letter, index) => <Tile key={index} letter={letter} valid={valid} index={index} handlePress={onTilePress} />)
            }
        </View>
    );
}
