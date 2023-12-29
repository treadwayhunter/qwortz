import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hardReset } from '../data/database';
import { useGameContext } from './contexts/GameContext';
import { useThemeContext } from './contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ThemeSwitch from './ThemeSwitch';

export function SettingsHeader() {
  const insets = useSafeAreaInsets();
  const [color, setColor] = useState('#094387');
  const navigation = useNavigation();
  const { theme, setTheme } = useThemeContext();

  return (
    <View aria-label='LevelListHeader'
        style={{
            width: '100%',
            paddingTop: insets.top,
            height: 80 + insets.top,
            backgroundColor: theme === 'light' ? '#094387' : '#121212',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row'
        }}>
        <View style={{ height: '100%', width: '25%', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesomeIcon icon={faArrowLeft} size={32} color={'white'} />
            </TouchableOpacity>
        </View>
        <View style={{ height: '100%', width: '50%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: 32 }}>Settings</Text>
        </View>
        <View style={{ height: '100%', width: '25%' }}></View>

    </View>
);

}

function SettingCard({ title, func }) {
  const { theme, setTheme } = useThemeContext();

  const color = '#098287';
  return (
    <View style={{ 
      height: 80, 
      width: '100%', 
      justifyContent: 'center', 
      borderBottomWidth: 2,
      backgroundColor: theme === 'light' ? '#fff' : '#2c2c2c',
      borderColor: theme === 'light' ? '#000' : '#fff' 
    }}>
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
          <Text style={{ fontSize: 24, color: theme === 'light' ? '#000' : '#fff' }}>{title}</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
}

export function Settings() {

  const navigation = useNavigation();
  const { gameState, gameDispatch } = useGameContext();
  const { theme, setTheme } = useThemeContext();

  function resetEverything() {
    hardReset()
      .then(() => {
        gameDispatch({ type: 'CHANGE_LEVEL', payload: 1 });
        navigation.navigate({ name: 'Game' });
      });
  }

  return (
    <View style={{ flex: 1, width: '100%', alignItems: 'center', backgroundColor: theme === 'light' ? '#fff' : '#121212' }}>
      <SettingCard title={"About"} />
      <SettingCard title={"Themes"} />
      <ThemeSwitch />
      <SettingCard title={"Achievements"} />
      <SettingCard title={"Reset Everything"} func={resetEverything} />
    </View>
  );
}
