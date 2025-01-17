import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image} from 'react-native';
import moment from 'moment';

const ServiceAdd = () => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) =>
    moment().add(i, 'days').format('YYYY-MM-DD')
  );

  return (
    <View style={styles.container}>
      <View
        style={styles.titleView}
      >
        <Text style={styles.title}>Today</Text>
        <TouchableOpacity>
          <Image source={require('../../assets/vectors/search.png')} style={styles.search} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={dates}
        horizontal
        style={styles.dateFlat}
        keyExtractor={(item) => item}
        ListFooterComponent={
        <TouchableOpacity>
          <Image source={require('../../assets/vectors/allDate.png')} style={styles.allDate} />
        </TouchableOpacity>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.dateItem}
            onPress={() => setSelectedDate(item)}
          >
            <Text
              style={[
                styles.dayText,
                moment(item).format('ddd')=== "Sun" && styles.sunday,
              ]}
            >
              {moment(item).format('ddd').toUpperCase()}
            </Text>
            <Text
              style={styles.dateText}
            >
              {moment(item).format('DD')}
            </Text>
            <View  style={[selectedDate === item && styles.selectedDateLine]}/>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EBEEFF',
    alignItems: 'center',
  },
  titleView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: 325,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins',
    color: '#4A4E69',
    fontWeight: '400',
  },
  search: {
    width: 30,
    height: 30,
  },
  dateFlat: {
    width: 326,
    height: 55,
    alignContent: 'center',
  },
  dateItem: {
    width: 32,
    marginRight: 10,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
  },
  selectedDateLine: {
    width: 20,
    height: 5,
    backgroundColor: '#22223B',
    borderRadius: 8,
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
  allDate: {
    width: 32,
    height: 55,
    resizeMode: 'contain',
  },
});

export default ServiceAdd;
