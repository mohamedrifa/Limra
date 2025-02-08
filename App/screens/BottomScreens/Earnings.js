import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';


const Earnings = () => {

  const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM YYYY'));
  const [months, setMonths] = useState([]);
  useEffect(() => {
    const past12Months = Array.from({ length: 12 }, (_, i) => {
      const month = moment().subtract(i, 'months');
      return {
        label: month.format('MMMM YYYY'),
        value: month.format('YYYY-MM'),
      };
    });
    setMonths(past12Months);
    setSelectedMonth(past12Months[0].value);
  }, []);

  return(
  <View style={styles.container}>
    <LinearGradient
      colors={['#5D5DA1', '#22223B']}
      style={styles.topContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}>
      <Text style={styles.topText}>Monthly Earnings</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={''}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          style={{position: 'absolute',  height: '100%', width: '100%',}}
          dropdownIconColor={'#F2E9E4'}
          >
          {months.map((month) => (
            <Picker.Item key={month.value} label={month.label} value={month.value} />
          ))}
        </Picker>
        <TouchableOpacity style={{flex: 1, flexDirection: 'row', alignItems: 'center',  pointerEvents: 'none',  justifyContent: 'center'}}>
          <Text style={styles.pickerText}>{moment(selectedMonth).format('MMMM YYYY')}</Text>
          <Image source={require('../../assets/vectors/pickerDownArrow.png')} style={{width: 8, height: 8, resizeMode: 'cover', marginLeft: 5}}/>
        </TouchableOpacity>
      </View>
      <Text style={styles.totalEarningsText}>Total Earnings</Text>
      <Text style={styles.totalText}>₹10250</Text>
    </LinearGradient>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F5F5'
  },
  topContainer: {
    width: '100%',
    height: 238,
  },
  topText: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 24,
    alignSelf: 'center',
    marginTop: 55,
    color: '#FFFFFF'
  },
  picker: {
    width: 100,
    height: 15,
    backgroundColor: '#F2E9E4',
    borderRadius: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexDirection: 'row',
    marginTop: 20,
  },
  pickerText: {
    fontFamily: 'Poppins',
    fontWeight: 300,
    fontSize: 10,
    color: '#22223B'
  },
  totalEarningsText: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 14,
    color: '#FFFFFF',
    alignSelf: 'center',
    marginTop: 29
  },
  totalText: {
    width: '100%',
    fontFamily: 'Quando',
    fontWeight: 400,
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center'
  },

});

export default Earnings;