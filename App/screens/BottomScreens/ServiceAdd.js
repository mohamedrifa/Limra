import React, { useState, useEffect} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image} from 'react-native';
import moment from 'moment';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../firebase';

const ServiceAdd = () => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const dates = Array.from({ length: 7 }, (_, i) =>
    moment().add(i, 'days').format('YYYY-MM-DD')
  );

  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    const customerRef = ref(database, 'customers');
    const unsubscribe = onValue(
      customerRef,
      (snapshot) => {
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
      },
      {
        onlyOnce: false,
      }
    );
    return () => unsubscribe(); 
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#EBEEFF' }}>
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.title}>Today</Text>
          <TouchableOpacity>
            <Image source={require('../../assets/vectors/search.png')} style={styles.search} />
          </TouchableOpacity>
        </View>
        <View style={{ height: 55 }}>
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
        <View style={styles.serviceListContainer}>
          <View style={styles.addButtonContainer}>
            <TouchableOpacity style={styles.addButton}>
              <Image source={require('../../assets/vectors/plus.png')} style={styles.addIcon} />
              <Text style={styles.addText}>Add Customer Profile</Text>
            </TouchableOpacity>
            <View style={styles.addButton}/>
          </View>
          <FlatList
            data={customers}
            style={{ marginTop: 10 }}
            ListFooterComponent={<View style={{height: 10}} />}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.listLine}/>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.address}>{item.address}</Text>
                <Text style={styles.machine}>{item.machine}</Text>
                <Text>{item.mobile}</Text>
                <Text>{item.city}</Text>
                <View style={styles.listLine}/>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EBEEFF',
    flex: 1,
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
  selectedDateLine: {
    width: 20,
    height: 5,
    backgroundColor: '#22223B',
    borderRadius: 8,
  },
  allDate: {
    width: 32,
    height: 55,
    resizeMode: 'contain',
  },
  serviceListContainer: {
    width: '100%',
    flex: 1,
    marginTop: 5,
  },
  addButtonContainer: {
    width: 328,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    width: 160,
    height: 67,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C9ADA7',
  },
  addIcon: {
    width: 16,
    height: 16,
    marginLeft: 10,
  },
  addText: {
    width: 115,
    height: 57,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 14,
    marginLeft: 10,
  },
  card: {
    width: '100%',
    height: 215,
    justifyContent: 'space-between',
  },
  listLine: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#22223B',
  },
});

export default ServiceAdd;
