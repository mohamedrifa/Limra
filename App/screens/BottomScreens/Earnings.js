import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Earnings = () => (
  <View style={styles.container}>
    <Text>Earnings</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Earnings;