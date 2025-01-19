import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import {View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, TextInput, Alert, StatusBar} from 'react-native';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    const updatedEmail = email.includes('@gmail.com') ? email : email + '@gmail.com';
    const updatedPassword = password.length >= 6 ? password : password + '1234';

    try {
      await auth().signInWithEmailAndPassword(updatedEmail, updatedPassword);
      Alert.alert('Success', 'You are logged in!');
      navigation.navigate("ApplicationMain");
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/loginbg.png')}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.page}>
        <Image source={require('../assets/images/LIMRA.png')} style={styles.title} />
        <View style={styles.line} />
        <Text style={styles.text}>Get started to your personal account</Text>

        <Text style={styles.prompt}>User id:</Text>
        <TextInput
          style={styles.input}
          placeholder="User Name"
          placeholderTextColor="#9A8C98"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.prompt}>Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9A8C98"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={handleLogin}>
          <LinearGradient
            colors={['#22223B', '#5D5DA1']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <Text style={styles.buttonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    width: 63,
    height: 27,
    resizeMode: 'contain',
    marginTop: 53,
    alignSelf: 'flex-start',
  },
  line: {
    width: 297,
    height: 1,
    backgroundColor: '#22223B',
  },
  text: {
    fontSize: 32,
    width: 297,
    marginTop: 40,
    textAlign: 'center',
    fontFamily: 'Questrial',
    fontWeight: '400',
    color: '#9A8C98',
  },
  prompt: {
    fontFamily: 'Questrial',
    color: '#4A4E69',
    fontWeight: '400',
    fontSize: 16,
    marginTop: 20,
  },
  input: {
    width: 247,
    height: 43,
    borderColor: '#22223B',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 15,
    fontSize: 16,
  },
  button: {
    width: 129,
    height: 46,
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 30,
  },
  buttonText: {
    color: '#F2E9E4',
    fontFamily: 'open-sans',
    fontWeight: '400',
    fontSize: 20,
    textAlign: 'center',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;
