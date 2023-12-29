import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Game from './components/Game';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Setup } from './components/Setup';
import { dropTables } from './data/database';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Settings, SettingsHeader } from './components/Settings';
import { LevelList, LevelListHeader } from './components/LevelList';
import { GameContextProvider } from './components/contexts/GameContext';
import Home from './components/Home';
import { ThemeContextProvider } from './components/contexts/ThemeContext';

const Stack = createNativeStackNavigator();



export default function App() {
  const [setupCheck, setSetupCheck] = useState(false);

  function handleSetup() {
    setSetupCheck(true);
  }

  if (!setupCheck) {
    return (
      <Setup handleSetup={handleSetup} />
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeContextProvider>
        <GameContextProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ animation: 'fade' }}>
              <Stack.Screen options={{ headerShown: false }} name="Home" component={Home} />
              <Stack.Screen options={{ headerShown: false }} name="Game" component={Game} />
              <Stack.Screen options={{ header: SettingsHeader, animation: 'default' }} name="Settings" component={Settings} />
              <Stack.Screen options={{ header: LevelListHeader, animation: 'default' }} name="Levels" component={LevelList} />
            </Stack.Navigator>
          </NavigationContainer>
        </GameContextProvider>
      </ThemeContextProvider>
    </SafeAreaProvider>
  );

}

