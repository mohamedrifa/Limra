import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import moment from 'moment';

export default function DayEarningsItem ({ date, customers }) {
  const dateWise = customers.filter(
    customer => customer.date === moment(date).format('YYYY-MM-DD')
  );

  if (dateWise.length === 0) return null;

  const dailyEarnings = dateWise.reduce(
    (sum, customer) => sum + Number(customer.billTotals?.commisionTotal || 0),
    0
  );

  return (
    <View style={{ width: '100%', height: 101, paddingHorizontal: 15, paddingVertical: 9 }}>
      {/* Day Header */}
      <View style={{ width: 54, height: 21, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: '300', color: '#22223B' }}>
          Day
        </Text>
        <Text style={{ fontFamily: 'Quantico', fontSize: 14, fontWeight: '400', color: '#22223B' }}>
          {moment(date).format('D')}
        </Text>
      </View>

      {/* Services */}
      <ScrollView
        style={{ height: 42, width: '80%' }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {dateWise.map(customer => (
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
            {customer.serviceType} - {customer.name}
          </Text>
        ))}
      </ScrollView>

      {/* Earnings */}
      <View style={styles.perDayContainer}>
        <Text style={styles.perDayText}>
          {dailyEarnings >= 0 ? dailyEarnings : -dailyEarnings}
        </Text>

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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  perDayContainer: {
    height: 23,
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