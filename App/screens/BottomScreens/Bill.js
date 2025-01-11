import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Bill = () => (
  <View style={styles.container}>
    <Text>Bill</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Bill;