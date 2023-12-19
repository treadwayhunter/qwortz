import { useState } from 'react';
import { View } from 'react-native';
import { Key } from './Key';
import { BackSpace } from './BackSpace';

export function Keyboard({ handlePress, backspace }) {
    const [color, setColor] = useState('#094387');

    return (
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
    );
}
