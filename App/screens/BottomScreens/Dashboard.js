import React from 'react';
import { View, Text, StyleSheet, StatusBar} from 'react-native';

const Dashboard = () => (
  <View style={styles.container}>
    <StatusBar hidden={true} translucent={true}/>
    <Text style = {styles.text}>Dashboard</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Quantico',
  },
});

export default Dashboard;
