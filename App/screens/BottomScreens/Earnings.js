import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import moment from 'moment';
import DayEarningsItem from '../../component/earnings/DayEarningsItem';
import Header from '../../component/earnings/Header';
import { fetchServiceList } from '../../api/serviceApi';

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
    const unsubscribe = fetchServiceList(setCustomers);
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
      <Header
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        months={months}
        monthlyServices={monthlyServices}
        monthlyEarnings={monthlyEarnings}
      />
      <FlatList
        data={dates}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 77 }} />}
        renderItem={({ item }) => (
          <DayEarningsItem
            date={item}
            customers={customers}
          />
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
});

export default Earnings;