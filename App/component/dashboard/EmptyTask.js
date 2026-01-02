import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmptyTaskList = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyTitle}>No Pending Tasks</Text>
    <Text style={styles.emptySubtitle}>
      Add new tasks to track your work efficiently{"  "}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '400',
    color: '#4A4E69',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '300',
    color: '#9A8C98',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default EmptyTaskList