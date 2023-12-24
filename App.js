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
import { LevelList } from './components/LevelList';

const Stack = createNativeStackNavigator();



export default function App() {
  const [setupCheck, setSetupCheck] = useState(false);
  // a function for performing initial setup on a page.

  //dropTables();

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
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="Game" component={Game} />
          <Stack.Screen options={{ header:  SettingsHeader}} name="Settings" component={Settings} />
          <Stack.Screen options={{ headerShown: true }} name="Levels" component={LevelList} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
