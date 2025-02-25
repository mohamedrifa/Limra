import React, {useEffect, useState, useRef} from 'react';
import { getDatabase, ref, onValue, set, get, update} from 'firebase/database';
import { database } from '../../firebase';
import moment from 'moment';
import { View, Text, StyleSheet, BackHandler, TouchableOpacity, FlatList, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function CustomerHistory({mobile, navigateToServiceAdd}){

  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    const customerRef = ref(database, 'ServiceList');
    const unsubscribe = onValue(customerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const filteredCustomers = Object.keys(data)
          .filter((key) => data[key]?.mobile === mobile)
          .map((key) => ({
            id: key,
            ...data[key],
          }));
          
        {/*  new Date(b.date) - new Date(a.date)   for descending order*/}
        const sortedCustomers = filteredCustomers.sort((a, b) => new Date(a.date) - new Date(b.date));
        setCustomers(sortedCustomers);
      } else {
        setCustomers([]);
      }
    });
  
    return () => unsubscribe();
  }, [mobile]); // Added `mobile` if it changes
  
  

  useEffect(() => {
      const backAction = () => {
        navigateToServiceAdd();
        return true;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [navigateToServiceAdd]);
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8D8D99', '#EBEBFF']}
        style={styles.topbar}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}>
        <View style={{flexDirection: 'row', marginTop: 48, marginLeft: 17, alignItems: 'center' }}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigateToServiceAdd()}>
            <Image source={require('../assets/vectors/arrowBack.png')} style={{width: 10, height: 18}} />
          </TouchableOpacity>
          <Text style={styles.titleText}>CUSTOMER HISTORY</Text>
        </View>
      </LinearGradient>
      <FlatList
        data={customers}
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 77 }} />}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const currentMonth = moment(item.date).format("MMMM YYYY");
          const prevMonth = customers[index - 1];
          let showMonthHeader = false;

          if ( index === 0 || moment(prevMonth.date).format("MMMM YYYY") !== currentMonth ) {
            showMonthHeader = true;
          }
          const nextItem = customers[index + 1];
          let isLastMonth = false;
          if(!nextItem || moment(nextItem.date).format("MMMM YYYY") !== currentMonth){
            isLastMonth = true;
          }
          return (
            <View style={styles.card}>
                {showMonthHeader && (
                  <View style={{ width: '100%', height: 64, alignItems: 'center', flexDirection: 'row', paddingLeft: 16 }}>
                    <Text style={[styles.monthHeader, {fontFamily: 'Poppins'}]}>{moment(item.date).format("MMMM")} </Text>
                    <Text style={[styles.monthHeader, {fontFamily: 'Quantico'}]}>{moment(item.date).format("YYYY")}</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.listView}>
                  <View style={{width:78, height: 44, alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 10}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={[styles.listDate, {fontFamily: 'Quantico'}]}>{moment(item.date).format("DD ")}</Text>
                      <Text style={[styles.listDate, {fontFamily: 'Poppins'}]}>{moment(item.date).format("MMM")}</Text>
                    </View>
                    <Image source={require('../assets/vectors/pin.png')} style={{width: 13, height: 13, marginTop: 5}}/>
                  </View>
                  <View style={[styles.lineView, index === 0 && {flexDirection: 'column-reverse'}]}>
                    <View 
                    style={[
                      customers.length !== 1 && styles.line,
                      index === 0 && {flex: 0.5},
                      index === customers.length - 1 && {flex: 0.5},
                      ]}/>
                    <View 
                      style={[
                        styles.ovalMark2,
                        showMonthHeader && styles.ovalMark1,
                        isLastMonth && styles.ovalMark1
                        ]}/>
                  </View>
                  <Text style={styles.serviceTypes}>{item.serviceType.replace(/, /g,', \n')}</Text>
                </TouchableOpacity>
            </View>
          );
        }}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  topbar: {
    width: '100%',
    height: 97,
  },
  backButton: {
    width: 35,
    height: 35,
    backgroundColor: "#C9ADA7",
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#4A4E69',
    marginLeft: 18,
  },
  monthHeader: {
    fontWeight: 400,
    fontSize: 14,
    color: '#4A4E69'
  },
  listView: {
    paddingHorizontal: 17,
    backgroundColor: '#EBF4FE',
    alignItems: 'center',
    flexDirection: 'row'
  },
  listDate: {
    color: '#22223B',
    fontWeight: 400,
    fontSize: 14,
  },
  serviceTypes: {
    fontFamily: 'Poppins',
    color: '#22223B',
    fontWeight: 400,
    fontSize: 16,
    marginLeft: 19,
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 10
  },
  lineView: {
    width: 16,
    height: '100%',
    marginLeft: 19,
    alignItems: 'center',
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: '#0080DA',
  },
  ovalMark1: {
    width: 10,
    height: 10,
    backgroundColor: '#0095FF',
    borderRadius: 5,
    position: 'absolute',
    alignSelf: 'center',
    top: '50%', 
    left: '50%',
    transform: [{ translateX: -5 }, { translateY: -5 }]
  },
  ovalMark2: {
    width: 15,
    height: 15,
    backgroundColor: '#0080DA',
    borderRadius: 10,
    position: 'absolute',
    alignSelf: 'center',
    top: '50%', 
    left: '50%',
    transform: [{ translateX: -7.5 }, { translateY: -7.5 }]
  }

});


