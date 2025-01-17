import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';

const ServiceAdd = () => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) =>
    moment().add(i, 'days').format('YYYY-MM-DD')
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today</Text>
      <FlatList
        data={dates}
        horizontal
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.dateItem,
              selectedDate === item && styles.selectedDateItem,
            ]}
            onPress={() => setSelectedDate(item)}
          >
            <Text
              style={[
                styles.dayText,
                moment(item).format('ddd')=== "Sun" && styles.sunday,
                selectedDate === item && styles.selectedDateText,
              ]}
            >
              {moment(item).format('ddd').toUpperCase()}
            </Text>
            <Text
              style={[
                styles.dateText,
                selectedDate === item && styles.selectedDateText,
              ]}
            >
              {moment(item).format('DD')}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  dateItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    
  },
  selectedDateItem: {
    backgroundColor: '#6200ee',
  },
  dateText: {
    fontSize: 20,
    color: '#4A4E69',
    fontWeight: '400',
    fontFamily: 'Quando',
  },
  dayText: {
    fontSize: 13,
    color: '#4A4E69',
    fontFamily: 'Poppins',
  },
  sunday: {
    color: '#E73D3D',
  },
  selectedDateText: {
    color: '#fff',
  },
});

export default ServiceAdd;
