import React from 'react';
import { View, Text, StyleSheet, StatusBar} from 'react-native';

const Dashboard = () => (
  <View style={styles.container}>
    <StatusBar hidden={true}/>
    <Text>Dashboard</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Dashboard;
