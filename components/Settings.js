import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hardReset } from '../data/database';
import { useGameContext } from './contexts/GameContext';

export function SettingsHeader() {
  const insets = useSafeAreaInsets();
  const [color, setColor] = useState('#094387');
  const navigation = useNavigation();

  return (
    <View style={{
      paddingTop: insets.top,
      paddingLeft: 20,
      paddingRight: 20,
      height: 80 + insets.top,
      width: '100%',
      backgroundColor: color,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row'
    }}>
      <TouchableOpacity
        style={{
          height: 50,
          width: 50,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ fontSize: 24, color: 'white' }}>Back</Text>
      </TouchableOpacity>
      <View><Text style={{ fontSize: 32, color: 'white' }}>Settings</Text></View>
      <View></View>
    </View>
  );
}

function SettingCard({ title, func }) {
  const color = '#874d09';
  return (
    <View style={{ height: 80, width: '100%', justifyContent: 'center', borderBottomWidth: 2 }}>
      <TouchableHighlight
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
        }}
        onPress={() => typeof func === 'function' ? func() : console.log('No function', title)}
        underlayColor={color}
      >
        <View style={{ marginLeft: 20 }}>
          <Text style={{ fontSize: 24 }}>{title}</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
}

export function Settings() {

  const navigation = useNavigation();
  const {gameState, gameDispatch} = useGameContext();

  function resetEverything() {
    hardReset()
      .then(() => {
        gameDispatch({type: 'CHANGE_LEVEL', payload: 1});
        navigation.navigate({ name: 'Game' });
      });
  }

  return (
    <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
      <SettingCard title={"About"} />
      <SettingCard title={"Themes"} />
      <SettingCard title={"Achievements"} />
      <SettingCard title={"Reset Everything"} func={resetEverything} />
    </View>
  );
}
