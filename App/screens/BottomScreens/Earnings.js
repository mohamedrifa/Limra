import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import moment from 'moment';
import DayEarningsItem from '../../component/earnings/DayEarningsItem';
import Header from '../../component/earnings/Header';
import { fetchServiceList } from '../../api/serviceApi';
import AddCustomerModal from '../../component/services/AddCustomerModal';

const generateDates = (month) => {
  const daysInMonth = moment(month, 'YYYY-MM').daysInMonth();
  return Array.from({ length: daysInMonth }, (_, i) =>
    moment(`${month}-${i + 1}`, 'YYYY-MM-DD').format('YYYY-MM-DD')
  );
};

const Earnings = ({AddCustomer, navigateToCustomerAdd}) => {
  const [customers, setCustomers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [tempCustomerId, setTempCustomerId] = useState("");
  const [months, setMonths] = useState([]);

  // 1️⃣ Prepare months
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

  // 2️⃣ Fetch data when month changes
  useEffect(() => {
    if (!selectedMonth) return;
    setCustomers([]);
    const unsubscribe = fetchServiceList(selectedMonth, setCustomers);
    return () => unsubscribe && unsubscribe();
  }, [selectedMonth]);

  // 3️⃣ Generate days once per month
  const dates = useMemo(
    () => generateDates(selectedMonth),
    [selectedMonth]
  );

  // 4️⃣ Monthly totals (memoized)
  const { monthlyEarnings, monthlyServices } = useMemo(() => {
    return customers.reduce(
      (acc, c) => {
        acc.monthlyServices += 1;
        acc.monthlyEarnings += Number(
          c.billTotals?.commisionTotal || 0
        );
        return acc;
      },
      { monthlyServices: 0, monthlyEarnings: 0 }
    );
  }, [customers]);

  const navigateBack = async () => {
    setTempCustomerId("");
    navigateToCustomerAdd(false);
  };

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
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 77 }} />}
        renderItem={({ item }) => (
          <DayEarningsItem
            date={item}
            customers={customers}
            setCustomer={setTempCustomerId}
            navigateToEdit={navigateToCustomerAdd}
          />
        )}
      />
      <AddCustomerModal
        visible={AddCustomer}
        navigateBack={()=>navigateBack()}
        customerId={tempCustomerId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});

export default Earnings;
