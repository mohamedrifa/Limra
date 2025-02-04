import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Dashboard = () => (
  <View style={styles.container}>
    <Text style = {styles.text}>Dashboard</Text>
    <View style={styles.serviceCalculator}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.calculatorHead}>overall</Text>
        <Text style={styles.calculatorData}>100</Text>
      </View>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.calculatorHead}>completed</Text>
        <Text style={styles.calculatorData}>100</Text>
      </View>
    </View>
    <View style={styles.plainContainer}>
        <Text style={styles.plainText}>Pending Tasks</Text>
        <Image source={require('../../assets/vectors/arrow_right.png')} style={styles.plainIcon}/>
      </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#EBEEFF',
  },
  text: {
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: 400,
    color: '#4A4E69',
    marginTop: 37
  },
  serviceCalculator: {
    flexDirection: 'row',
    width: 246,
    justifyContent: 'space-between',
    marginTop: 13,
  },
  calculatorHead: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 16,
    color: '#9A8C98',
  },
  calculatorData: {
    fontFamily: 'Quantico-Bold',
    fontSize: 24,
    color: '#4A4E69',
    textShadowColor: '#00000040',
    textShadowOffset: { width: 0, height: 4 }, 
    textShadowRadius: 4,
  },
  plainContainer: {
    paddingHorizontal: 17,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 13,
    justifyContent: 'space-between'
  },
  plainText: {
    fontFamily: 'Poppins',
    fontSize: 20,
    color: '#4A4E69',
    fontWeight: 400,
  },
  plainIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  }
});

export default Dashboard;
