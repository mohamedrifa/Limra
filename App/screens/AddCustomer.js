import React, { useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';

export default function AddCustomer({ navigateToServiceAdd }) {
  useEffect(() => {
    const backAction = () => {
      navigateToServiceAdd(); // Call the function correctly
      return true; // Prevent app from exiting
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove(); // Cleanup the event listener
  }, [navigateToServiceAdd]); // Dependency array should include navigateToServiceAdd

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add Customer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
