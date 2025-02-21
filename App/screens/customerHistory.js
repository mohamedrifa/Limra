import React, {useEffect} from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';

export default function CustomerHistory({mobile, navigateToServiceAdd}){
  useEffect(() => {
      const backAction = () => {
        navigateToServiceAdd();
        return true;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [navigateToServiceAdd]);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{mobile}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});


