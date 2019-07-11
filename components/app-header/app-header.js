import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import styles from '../../styles';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>Mobivate</Text>
      </View>
    );

  }
  
}


