import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import AutonomousCarApp from './scr/screens/AutonomousCarApp';

export default function App() {
  return (
    <ImageBackground source={require('./scr/components/bg.png')} style={styles.backgroundImage}>
      <AutonomousCarApp />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
});

