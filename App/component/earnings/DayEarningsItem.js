import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';

export default function DayEarningsItem ({ date, customers, setCustomer, navigateToEdit }) {
  const dateWise = customers.filter(
    customer => customer.date === moment(date).format('YYYY-MM-DD')
  );

  if (dateWise.length === 0) return null;

  const dailyEarnings = dateWise.reduce(
    (sum, customer) => sum + Number(customer.billTotals?.commisionTotal || 0),
    0
  );
  const moveToEdit = (id) => {
    navigateToEdit(true);
    setCustomer(id)
  }
  const profitPerCustomer = (profit) => (profit !== null && profit !== undefined && profit !== 0) ? `₹${profit}` : "";

  return (
    <View style={{ width: '100%', paddingHorizontal: 15, paddingVertical: 9 }}>
      {/* Day Header */}
      <View style={{ width: '100%', height: 21, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: '300', color: '#22223B' }}>
          Day
        </Text>
        <Text style={{ fontFamily: 'Quantico', fontSize: 14, fontWeight: '400', color: '#22223B', marginLeft: 10 }}>
          {moment(date).format('D')}
        </Text>
        <View style={{flex: 1, backgroundColor: '#22223B', height: 1, marginLeft: 10}}/>
      </View>
      {/* Services */}
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        <View
          style={{ width: '80%' }}>
          {dateWise.map(customer => (
            <TouchableOpacity onPress={()=>moveToEdit(customer.id)}>
              <Text
                key={customer.id}
                style={{
                  fontFamily: 'Poppins',
                  fontSize: 14,
                  fontWeight: '300',
                  color: '#22223B',
                  marginTop: 10,
                }}
              >
               • {customer.serviceType} - {customer.name} {profitPerCustomer(customer.billTotals?.commisionTotal)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Earnings */}
        <View style={styles.perDayContainer}>
          {dailyEarnings !== 0 && (
            <Image
              source={
                dailyEarnings > 0
                  ? require('../../assets/vectors/plusViolet.png')
                  : require('../../assets/vectors/minusViolet.png')
              }
              style={styles.perDayIcon}
            />
          )}
          <Text style={styles.perDayText}>
            {dailyEarnings >= 0 ? dailyEarnings : -dailyEarnings}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  perDayContainer: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  perDayIcon: {
    width: 10,
    height: 10,
    marginRight: 10,
    resizeMode: 'contain',
  },
  perDayText: {
    fontFamily: 'Quando',
    fontWeight: 400,
    fontSize: 18,
    color: '#22223B',
  }
});