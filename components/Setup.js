import { useEffect } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initdb } from '../data/database';

export function Setup({ handleSetup }) {

  // a function that changes the state
  function wait(ms) {
    setTimeout(() => {
      handleSetup(); // when called, this sets the parent App component setupCheck to true
    }, ms);
  }

  useEffect(() => {
    AsyncStorage.getItem('initDB')
      .then((value) => {
        if (!value) {
          console.log('Init Database From Setup Page');
          initdb();
          AsyncStorage.setItem('initDB', 'init'); // initialize to init, which means it's good
          wait(10000); // 10 seconds for testing purposes          
        }
        else {
          // the database was initialized
          handleSetup(); // just call this immediately
        }
      });
  });

  return (
    <View style={{ flex: 1, width: '100%', backgroundColor: '#094387', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 32, color: 'white' }}>Initial Setup!</Text>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}
