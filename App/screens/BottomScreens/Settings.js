import React from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth'; 
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
      <Image source={require('../../assets/images/settingsbg.png')} style={styles.bgImage}/>
      <Image source={require('../../assets/images/LIMRA.png')} style={styles.titleImage}/>
      <Text style={styles.text}>custom technician app</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity>
          <Text style={styles.containerText}>🔑 Change password</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.containerText}>📖 Terms and conditions</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.containerText}>📞 contact support</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.containerText}>🚀 app version v1.0.0</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#EBEBFF'
  },
  bgImage: {
    resizeMode: 'cover',
    width: '100%',
    height: 169,
  },
  titleImage: {
    width: 151,
    height: 65,
    resizeMode: 'contain'
  },
  text: {
    fontSize: 16,
    fontFamily: 'Poppins',
    marginTop: 6,
    fontWeight: 300,
    color: '#22223B'
  },
  buttonContainer: {
    width: 328,
    height: 195,
    justifyContent: 'space-between',
    marginTop: 83
  },
  containerText: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: 300,
    color: '#22223B',
  },
  logout: {
    width: 120,
    height: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#9A8C98',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 48,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Poppins',
    fontWeight: 700,
    color: '#22223B'
  }
});

export default Settings;
