import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';

const Header = React.memo(({
  selectedMonth,
  setSelectedMonth,
  months,
  monthlyServices,
  monthlyEarnings,
}) => {
  return (
    <LinearGradient 
      colors={['#5D5DA1', '#22223B']} 
      style={styles.topContainer}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}>
      <Text style={styles.topText}>Monthly Earnings</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          style={{ position: 'absolute', height: '100%', width: '100%' }}
          dropdownIconColor={'#F2E9E4'}
        >
          {months.map((month) => (
            <Picker.Item key={month.value} label={month.label} value={month.value} />
          ))}
        </Picker>
        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', pointerEvents: 'none', justifyContent: 'center' }}>
          <Text style={styles.pickerText}>{moment(selectedMonth).format('MMMM YYYY')}</Text>
          <Image source={require('../../assets/vectors/pickerDownArrow.png')} style={{ width: 8, height: 8, resizeMode: 'cover', marginLeft: 5 }} />
        </TouchableOpacity>
      </View>
      <View style={{width: 254, height: 71, flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center'}}>
          <View>
            <Text style={styles.totalEarningsText}>Total Services</Text>
            <Text style={styles.totalText}>{monthlyServices}</Text>
          </View>
          <View>
            <Text style={styles.totalEarningsText}>Total Earnings</Text>
            <Text style={styles.totalText}>₹{monthlyEarnings}</Text>
          </View>
      </View>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
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

export default Header;
