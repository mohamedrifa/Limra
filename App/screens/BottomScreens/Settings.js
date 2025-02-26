import React, {useState} from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth'; 
import RNRestart from 'react-native-restart';
import { Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView, TextInput } from 'react-native-gesture-handler';


export default function Settings ({changePass, terms, sendToChange, sendTerms}) {
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

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')

  const reauthenticateUser = async (currentPassword) => {
    const user = auth().currentUser;
    if (user && user.email) {
      const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
      await user.reauthenticateWithCredential(credential);
    }
  };

  const updatePassword = async (newPassword, currentPassword) => {
    try {
      await reauthenticateUser(currentPassword); // First, re-authenticate
      await auth().currentUser?.updatePassword(newPassword);
      Alert.alert('Success', 'Password updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      Alert.alert('Note', 'Password must be at least 8 characters long.');
      return;
    }
    if(newPassword !== confirmPassword) {
      Alert.alert('Note', "Both passwords don't match.");
      return;
    }
    try {
      const updatedCurrentPassword = password.length >= 6 ? password : password + '1234';
      await updatePassword(newPassword, updatedCurrentPassword);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  
  const changePassword = () => {
    sendToChange(true);
  };
  const termsAndConditions = () => {
    sendTerms(true);
  };
  const contactSupport = async () => {
    const number = "+91 89030 78127";
    const dialUrl = `tel:${number}`;
    try {
      return await Linking.openURL(dialUrl);
    } catch (err) {
      Alert.alert("Error","Unable to open Dial Pad");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/settingsbg.png')} style={styles.bgImage}/>
      <View style={{alignItems: 'center'}} >
      <Image source={require('../../assets/images/LIMRA.png')} style={styles.titleImage}/>
      <Text style={styles.text}>custom technician app</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={changePassword}>
          <Text style={styles.containerText}>🔑 Change password</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={termsAndConditions}>
          <Text style={styles.containerText}>📖 Terms and conditions</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={contactSupport}>
          <Text style={styles.containerText}>📞 contact support</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.containerText}>🚀 app version v1.0.0</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
      {
        changePass && (
        <View style={styles.blurView} >
          <View style={styles.TaskContainer}>
            <LinearGradient
              colors={['#342F33', '#9A8C98']}
              style={{width: '100%', borderTopRightRadius: 5, borderTopLeftRadius: 5, height: 43, alignItems: 'center', justifyContent: 'center'}}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text style={styles.taskTitle}>Change password</Text>
            </LinearGradient>
            <TextInput
              style={[styles.input, {marginTop: 20}]}
              placeholder='Old Password'
              placeholderTextColor={'#4A4E69'}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder='New Password'
              placeholderTextColor={'#4A4E69'}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder='Confirm Password'
              placeholderTextColor={'#4A4E69'}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <View style={{ width: '100%', flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center', paddingHorizontal: 10,}}>
              <TouchableOpacity style={[styles.passwordConfirm, {borderWidth: 1}]} onPress={()=>sendToChange(false)}>
                <Text style={[styles.passwordConfirmText, {color: '#22223B'}]}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.passwordConfirm} onPress={handleChangePassword}>
                <LinearGradient
                  colors={['#22223B', '#5D5DA1']}
                  style={[styles.passwordConfirm, {width: '100%'}]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                  <Text style={[styles.passwordConfirmText, {color: '#FFFFFF'}]}>Confirm</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>) 
      }
      {
        terms && (
        <View style={styles.blurView} >
          <View style={[styles.TaskContainer, {paddingBottom: 10}]}>
            <LinearGradient
              colors={['#342F33', '#9A8C98']}
              style={{width: '100%', borderTopRightRadius: 5, borderTopLeftRadius: 5, height: 43, alignItems: 'center', justifyContent: 'center'}}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text style={styles.taskTitle}>Terms and Conditions</Text>
            </LinearGradient>
            <ScrollView style={{width: '95%'}}>
              <Text style={styles.termsHeading}>Terms and Conditions for Limra App:</Text>
              <Text style={styles.termsText}>   Welcome to the Custom Technician App. These Terms and Conditions govern your use of the app, which facilitates day-to-day service management, to-do lists, bill generation, and earnings calculations. By using this app, you agree to comply with these terms.</Text>
              <Text style={styles.termsHeading}>Use of the App</Text>
              <Text style={styles.termsText}>   The app is designed for technicians to store service records, manage tasks, generate bills, and track earnings.
Users must provide accurate and up-to-date information to ensure proper functionality.
Unauthorized access, modification, or duplication of the app’s features is strictly prohibited.</Text>
              <Text style={styles.termsHeading}>Data Storage and Security</Text>
              <Text style={styles.termsText}>   The app securely stores service records, invoices, and earnings data.
While we take precautions to protect data, we are not responsible for any data loss due to unforeseen circumstances.
Users should regularly back up important information.</Text>
              <Text style={styles.termsHeading}>Billing and Transactions</Text>
              <Text style={styles.termsText}>   The app allows technicians to generate invoices based on services provided.
The app does not process payments directly; users are responsible for collecting payments from clients.
Any disputes regarding payments must be resolved between the technician and the client.</Text>
              <Text style={styles.termsHeading}>Limitations of Liability</Text>
              <Text style={styles.termsText}>   The app is provided "as is" without warranties of any kind.
              We are not liable for any loss, damages, or errors arising from app usage.</Text>
              <Text style={styles.termsHeading}>Modifications and Updates</Text>
              <Text style={styles.termsText}>   We reserve the right to update or modify these terms at any time.
              Continued use of the app after modifications constitutes acceptance of the updated terms.</Text>
              <Text style={styles.termsHeading}>Contact Information</Text>
              <Text style={styles.termsText}>   For any questions or concerns, please contact support.
              By using the Custom Technician App, you agree to these terms and conditions. If you do not agree, please discontinue use immediately.</Text>
            </ScrollView>
            <TouchableOpacity style={[styles.passwordConfirm, {borderWidth: 1}]} onPress={()=>sendTerms(false)}>
              <Text style={[styles.passwordConfirmText, {color: '#22223B'}]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>)
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EBEBFF'
  },
  bgImage: {
    resizeMode: 'stretch',
    width: '110%',
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
    marginBottom: 100
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Poppins',
    fontWeight: 700,
    color: '#22223B'
  },
  blurView: {
    borderRadius: 5,
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000099',
  },
  TaskContainer: {
    width: '95%',
    height: 300,
    marginTop: 63,
    alignItems: 'center',
    backgroundColor: '#EBEEFF',
    borderRadius: 5,
  },
  taskTitle: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: 400,
    color: '#FFFFFF'
  },
  input: {
    width: '95%',
    height: 43,
    borderColor: '#22223B',
    color: '#4A4E69',
    fontFamily: 'Poppins',
    paddingHorizontal: 16,
    fontWeight: 400,
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 19,
  },
  passwordConfirm: {
    width: '30%',
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  passwordConfirmText:{
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: 400,
  },
  termsText: {
    color: 'black',
    fontSize: 15,
    textAlign: 'justify'
  },
  termsHeading: {
    color: 'black',
    fontSize: 15,
    marginTop: 15,
    fontWeight: 500
  }
});



