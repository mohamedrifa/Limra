import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, StatusBar} from 'react-native';

const Start = ({ onNext }) => (
    <ImageBackground
        source={require('../assets/images/startbg.jpg')}
        style={styles.background}
        resizeMode="cover">
        <View style={styles.page}>
            <Image 
                source={require('../assets/images/LIMRA.png')}  // Ensure this path is correct
                style={styles.image}/>
            <Text style={styles.text}>"Simplify Your Service Records"</Text>
            <TouchableOpacity style={styles.button} onPress={onNext}>
                <LinearGradient
                    colors={['#22223B', '#5D5DA1']} 
                    style={styles.button}
                    start={{ x: 0, y: 0 }} 
                    end={{ x: 1, y: 0 }}>
                    <Text style={styles.buttonText}>Get Started &gt;</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    </ImageBackground>
);
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'space-between',
    padding: 20,
  },
  text: {
    width:304,
    height:50,
    fontSize: 24,
    fontWeight:400,
    marginTop: 20,
    marginBottom:300,
    lineHeight:24.72,
    textAlign:'center',
    fontFamily:'Questrial',
    color: '#4A4E69', 
  },
  image: {
    width: 151, 
    height: 65,
    resizeMode:"contain",
    marginTop:150,
    marginBottom: 20, 
  },
  button: {
    width:309,
    height:46,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent:'center',
    borderRadius: 5,
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
