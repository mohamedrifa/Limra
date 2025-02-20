import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../firebase';
import moment from 'moment';

const generateDates = (month) => {
  const daysInMonth = moment(month).daysInMonth();
  return Array.from({ length: daysInMonth }, (_, i) =>
    moment(`${month}-${i + 1}`, "YYYY-MM-DD").format("dddd, MMM D YYYY")
  );
};
const Earnings = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));
  const [months, setMonths] = useState([]);

  useEffect(() => {
    const customerRef = ref(database, 'ServiceList');
    const unsubscribe = onValue(customerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const customerList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setCustomers(customerList);
      } else {
        setCustomers([]);
      }
    });

    return () => unsubscribe();
  }, []);

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

  const dates = generateDates(selectedMonth);

  let monthlyEarnings = customers.reduce((sum, customer) => {
    let customerMonth = moment(customer.date).format("YYYY-MM");
    let selectedMonthFormatted = moment(selectedMonth).format("YYYY-MM");
    return sum + Number(customerMonth === selectedMonthFormatted ? (customer.billTotals?.commisionTotal || 0) : 0);
  }, 0);

  let monthlyServices = customers.reduce((sum, customer) => {
    let customerMonth = moment(customer.date).format("YYYY-MM");
    let selectedMonthFormatted = moment(selectedMonth).format("YYYY-MM");
    return sum + Number(customerMonth === selectedMonthFormatted ? 1 : 0);
  }, 0);
  return (
    <View style={styles.container}>
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
      <FlatList
        data={dates}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 77 }} />}
        renderItem={({ item: date }) => {
          const dateWise = customers.filter(customer => 
            customer.date === moment(date).format("YYYY-MM-DD")
          );
          let dailyEarnings = dateWise.reduce((sum, customer) => 
            sum + Number(customer.billTotals?.commisionTotal || 0), 0);

          if (dateWise.length === 0) return null;
          
          return (
            <View style={{ width: '100%', height: 101, paddingHorizontal: 15, paddingVertical: 9 }}>
              <View style={{ width: 54, height: 21, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: '300', color: '#22223B' }}>Day</Text>
                <Text style={{ fontFamily: 'Quantico', fontSize: 14, fontWeight: '400', color: '#22223B' }}>{moment(date).format("D")}</Text>
              </View>
              <ScrollView 
                style={{ height: 42, width: '100%' }}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}>
                {dateWise.map((customer) => (
                  <Text key={customer.id} style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 300, color: '#22223B', marginTop: 10 }}>
                    {customer.serviceType} - {customer.name}
                  </Text>
                ))}
              </ScrollView>
              { dailyEarnings>0 ? (
                <View style={styles.perDayContainer}>
                  <Text style={styles.perDayText}>{dailyEarnings}</Text>
                  <Image source={require('../../assets/vectors/plusViolet.png')} style={styles.perDayIcon} />
                </View>
              ): dailyEarnings>0 ?(
                <View style={styles.perDayContainer}>
                  <Text style={styles.perDayText}>{-dailyEarnings}</Text>
                  <Image source={require('../../assets/vectors/minusViolet.png')} style={styles.perDayIcon} />
                </View>
              ):(
                <View style={styles.perDayContainer}>
                  <Text style={styles.perDayText}>{-dailyEarnings}</Text>
                </View>
              )
              }
            </View>
          );
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  perDayContainer: {
    height: 23,
    width: 65,
    position: 'absolute',
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    top: 39,
    right: 15,

  },
  perDayIcon: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },
  perDayText: {
    fontFamily: 'Quando',
    fontWeight: 400,
    fontSize: 18,
    color: '#22223B',
  }

});

export default Earnings;