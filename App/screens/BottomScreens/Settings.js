import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth'; 
import LoginPages from '../../loginPages';
import RNRestart from 'react-native-restart';

const Settings = ({ navigation }) => {
  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        RNRestart.Restart(); 
      })
      .catch(error => {
        console.error('Logout failed: ', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginBottom: 20,
    fontSize: 18,
  },
});

export default Settings;
