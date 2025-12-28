import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import moment from 'moment';
import { TextInput } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';


export default function TopBar({
  searchQuery,
  setSearchQuery,
  searchHandler,
  selectedDate,
  setSelectedDate,
  searchActive,
  setSearchActive,
  dates,
  open,
  setOpen,
  date,
  setDate,
}) {

  return(
    <>
      <View style={styles.titleView}>
        { searchActive ? (
            <View style={styles.searchView}>
              <TouchableOpacity onPress={() => setSearchActive(false)}>
                <Image source={require('../../assets/vectors/arrowBack.png')} style={{width: 20, height: 20, resizeMode: 'contain'}} />
              </TouchableOpacity>
              <TextInput placeholder='     search profiles' style={styles.search} value={searchQuery} onChangeText={text => setSearchQuery(text)} placeholderTextColor={'#4A4E69'}/>
            </View>
          ): (
            <Text style={styles.title}>
              {selectedDate === moment().format('YYYY-MM-DD')
              ? 'Today'
              : selectedDate === moment().add(1, 'days').format('YYYY-MM-DD')
              ? 'Tomorrow'
              : selectedDate === moment().add(-1, 'days').format('YYYY-MM-DD')
              ? 'Yesterday'
              : moment(selectedDate).format('DD-MMM-YYYY')}
            </Text> )}
        <TouchableOpacity onPress={()=>{setSearchActive(true);searchHandler && searchHandler();}} style={{position: 'absolute', right: 18, top: 7}}>
          <Image source={require('../../assets/vectors/search.png')} style={{width: 30, height: 30}} />
        </TouchableOpacity>
      </View>
      {!searchActive ? (
          <View style={{ height: 55, width:'100%', flexDirection: 'row-reverse', paddingLeft: 16, paddingRight: 16}}>
            <TouchableOpacity onPress={() => setOpen(true)} >
              <Image source={require('../../assets/vectors/allDate.png')} style={styles.allDate} />
              <DatePicker
                modal
                open={open}
                date={date}
                mode="date" // Can be 'date', 'time', or 'datetime'
                onConfirm={(selectedDate) => {
                  setOpen(false);
                  setDate(selectedDate);
                  setSelectedDate(moment(selectedDate).format('YYYY-MM-DD'));
                }}
                onCancel={() => setOpen(false)}
              />
            </TouchableOpacity>
            <FlatList
              data={dates}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.dateFlat}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.dateItem} onPress={() => setSelectedDate(item)}>
                  <Text style={[styles.dayText,moment(item).format('ddd')=== "Sun" && styles.sunday,]}>
                    {moment(item).format('ddd').toUpperCase()}
                  </Text>
                  <Text style={styles.dateText}>
                    {moment(item).format('DD')}
                  </Text>
                  <View  style={[selectedDate === item && styles.selectedDateLine]}/>
                </TouchableOpacity>
              )}
            />
          </View>
        ):null
      }
    </>
  );
}

const styles = StyleSheet.create({
  titleView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 25,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins',
    color: '#4A4E69',
    fontWeight: '400',
  },
  search: {
    width: '85%',
    color: '#4A4E69',
  },
  searchView: {
    width: '100%',
    height: 43,
    flexDirection: 'row',
    borderColor: '#22223B',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  dateFlat: {
    width: '100%',
    height: 60,
    alignContent: 'center',
  },
  dateItem: {
    width: 'auto',
    height: 55,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
});