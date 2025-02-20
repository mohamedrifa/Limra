import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Dimensions } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';

const { width } = Dimensions.get('window');
const Start = ({ onNext }) => (
    <View style={styles.page}>
      <Image 
          source={require('../assets/images/LIMRA.png')}  // Ensure this path is correct
          style={styles.image}/>
      <Text style={styles.text}>"Simplify Your Service Records"</Text>
      <Image
        source={require('../assets/images/startbg.png')} 
        style={styles.downBg}/>
      <TouchableOpacity style={[styles.button, {position: 'absolute'}]} onPress={onNext}>
        <LinearGradient
            colors={['#22223B', '#5D5DA1']} 
            style={[styles.button, {elevation: 3}]}
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 0 }}>
            <Text style={styles.buttonText}>Get Started &gt;</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
);
const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'space-between',
  },
  downBg: {
    width: '100%',
    height: width,
    resizeMode: 'contain',
    alignItems: 'center',
    flexDirection: 'column-reverse'
  },
  text: {
    width:304,
    height:50,
    fontSize: 24,
    fontWeight:400,
    lineHeight:24.72,
    textAlign:'center',
    fontFamily:'Questrial',
    color: '#4A4E69', 
    textShadowColor: '#aaa', 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  image: {
    width: 158, 
    height: 34,
    resizeMode:"contain",
    marginTop:250,
    marginBottom: 20, 
  },
  button: {
    width:309,
    height:46,
    bottom: 20,
    alignItems: 'center',
    justifyContent:'center',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4},
  },
  buttonText: {
    color: '#F2E9E4',
    fontFamily:'Open Sans Light ',
    fontWeight:400,
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Start;
