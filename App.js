import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import LoginScreen from './app/screens/LoginScreen';

export default class App extends React.Component {
  render() {
    return <LoginScreen/>;
  }
}

