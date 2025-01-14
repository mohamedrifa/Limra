import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth'; // Ensure this package is installed and linked
import LoginPages from '../../loginPages';

const ProfileScreen = ({ navigation }) => {
  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        // Redirect to Login screen
        navigation.replace("LoginPages"); // Replace ensures user can't go back to the previous screen
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

export default ProfileScreen;
