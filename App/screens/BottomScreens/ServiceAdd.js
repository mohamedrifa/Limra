import React, { useState, useEffect} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Keyboard, Image, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { getDatabase, ref, onValue, set, get, update} from 'firebase/database';
import { database } from '../../../firebase';
import { Linking } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
import AddProfile from '../AddCustomer'
import CustomerHistory from '../customerHistory';

export default function ServiceAdd({ navigateToCustomerAdd, navigateToMessages, AddCustomer, navigateToHistory, history}){
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [customerId, setCustomerId] = useState("");
  const [mobile, setMobile] = useState();


  const dates = Array.from({ length: 30 }, (_, i) =>
    moment().add(-i, 'days').format('YYYY-MM-DD')
  );
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    const customerRef = ref(database, 'ServiceList');
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

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const customerAdd = async () => {
    setCustomerId(moment().format('YYYYMMDDHHmmss'));
    navigateToCustomerAdd(true);
  };
  const editCustomer = async (Id) => {
    setCustomerId(Id);
    navigateToCustomerAdd(true);
  };
  const customerHistory = async (mobile) => {
    setMobile(mobile);
    navigateToHistory(true);
  };
  const navigateBack = async () => {
    setCustomerId("");
    setMobile();
    navigateToHistory(false);
    navigateToCustomerAdd(false);
  };
  const openWhatsApp = (mobileNumber) => {
    const number = mobileNumber || "9876543210";
    const whatsappUrl = `https://wa.me/${number}`;
    try {
      return Linking.openURL(whatsappUrl);
    }catch (error) {
      Alert.alert("Error","Unable to open WhatsApp");
    }
    return Linking.openURL(whatsappUrl);
  };
  const openDialPad = async (mobileNumber) => {
    const number = mobileNumber || "9876543210";
    const dialUrl = `tel:${number}`;
    try {
      return await Linking.openURL(dialUrl);
    } catch (err) {
      Alert.alert("Error","Unable to open Dial Pad");
    }
  };
  const [searchActive, setSearchActive] = useState(false);
  const searchHandler = async () => {
    if(searchActive === false){
      setSearchActive(true);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const filteredCustomers = customers.filter(item =>
    (item.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (item.city?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (item.address?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (item.mobile || "").includes(searchQuery)
  );
  const highlightText = (text, searchQuery) => {
    if (!text || !searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    if (searchActive){
      return parts.map((part, index) =>
        part.toLowerCase() === searchQuery.toLowerCase() ? (
          <Text key={index} style={styles.highlight}>{part}</Text>
        ) : (
          part
        )
      );
    }
    return text;
  };
  const addToTask = async (customerId) => {
    const db = getDatabase();
    const customerRef = ref(db, `/ServiceList/${customerId}`);
    try {
      const snapshot = await get(customerRef); // Fetch customer data once
      if (!snapshot.exists()) return;
      const taskRef = ref(db, "Tasks/overallTasks");
      const overallSnapshot = await get(taskRef); // Fetch overallTasks count once
      const overallTasks = overallSnapshot.exists() ? overallSnapshot.val() : 0;
      const { billItems, billTotals, ...filteredData } = snapshot.val();
      filteredData.isAddedToProfile = false;
      filteredData.date = moment().format('YYYY-MM-DD');
      const autoId = moment().format('YYYYMMDDHHmmss')
      await set(ref(db, `/Tasks/${autoId}`), filteredData);
      const snapshot1 = await get(ref(db, `/Tasks/${autoId}`));
      if (snapshot1.exists()) {
        await update(ref(db, "Tasks"), { overallTasks: overallTasks + 1 });
      }
      Alert.alert("Success", "Task Added");
    } catch (error) {
      Alert.alert("Error", error.message);
      console.log(error);
    }
  };
  
  
  return (
    <View style={{ flex: 1, backgroundColor: '#EBEEFF', marginBottom: keyboardHeight }}>
      <View style={styles.container}>
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
                ? 'Tomarrow'
                : selectedDate === moment().add(-1, 'days').format('YYYY-MM-DD')
                ? 'Yesterday'
                : moment(selectedDate).format('DD-MMM-YYYY')}
              </Text> )}
          <TouchableOpacity onPress={searchHandler} style={{position: 'absolute', right: 18, top: 7}}>
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
        <View style={styles.serviceListContainer}>
          <Text style={styles.noDataText}>No Entries</Text>
          {!searchActive ? (
            <View style={styles.addButtonContainer}>
            <TouchableOpacity style={[styles.addButton, {width: '49%'}]} onPress={customerAdd}>
              <LinearGradient
                colors={['#22223B', '#5D5DA1']}
                style={[styles.addButton, {width: '100%'}]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <Image source={require('../../assets/vectors/plus.png')} style={styles.addIcon} />
                <Text style={styles.addText}>Add Customer Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.addButton, {width: '49%'}]} onPress={() => navigateToMessages()}>
              <LinearGradient
                colors={['#22223B', '#5D5DA1']}
                style={[styles.addButton, {width: '100%'}]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <Image source={require('../../assets/vectors/messageWhite.png')} style={styles.addIcon} />
                <Text style={styles.addText}>Messages</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          ): null
          }
          <FlatList
            data={searchActive ? filteredCustomers : customers}
            style={{ marginTop: 10 }}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{height: 77}} />}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              if(item.date === selectedDate || searchActive) {
                return (
                  <View style={styles.card}>
                    <View style={styles.listLine}/>
                    <View style={styles.listView}>
                      <View style={styles.listDatas}>
                        <ScrollView style={styles.listDatas} showsVerticalScrollIndicator={false}>
                          <Text style={styles.name}>{highlightText(item.name, searchQuery)}</Text>
                          <Text style={styles.city}>{highlightText(item.city, searchQuery)}</Text>
                          <Text style={styles.address}>{highlightText(item.address, searchQuery)}</Text>
                          <Text style={styles.machine}>{highlightText(item.serviceType, searchQuery)}</Text>
                          <Text style={styles.mobile}>{highlightText(item.mobile, searchQuery)}</Text>
                        </ScrollView>
                      </View>
                      <View style={{width: 101, height: 195, justifyContent: 'space-between'}}>
                        <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={() => editCustomer(item.id)}>
                          <Image source={require('../../assets/vectors/profileEdit.png')} style={{width: 24, height: 24}}/>
                        </TouchableOpacity>
                        <View style={styles.listIcons}>
                          <TouchableOpacity onPress={() => customerHistory(item.mobile)}>
                            <Image source={require('../../assets/vectors/history.png')} style={{width: 27, height: 27}} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => openDialPad(item.mobile)}>
                            <Image source={require('../../assets/vectors/call.png')} style={{width: 27, height: 27}} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => openWhatsApp(item.mobile)}>
                            <Image source={require('../../assets/vectors/whatsapp.png')} style={{width: 27, height: 27}} />
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.addToTask}  onPress={() => addToTask(item.id)}>
                          <Text style={styles.addToTaskText}>Add To Task</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.listLine}/>
                  </View>
                );
              }
              return null;
            }}
          />
        </View>
      </View>
      { AddCustomer && (
        <View style={{position: 'absolute', width: '100%', height: '100%'}}>
          <AddProfile navigateToServiceAdd={() => navigateBack()} customerId={customerId}/>
        </View>
      )}
      { history && (
        <View style={{position: 'absolute', width: '100%', height: '100%'}}>
          <CustomerHistory mobile={mobile} navigateToServiceAdd={() => navigateBack()}/>;
        </View>
      )}
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
  highlight: {
    backgroundColor: '#F3FF00',
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
  serviceListContainer: {
    width: '100%',
    flex: 1,
    marginTop: 5,
  },
  addButtonContainer: {
    width: '100%',
    paddingHorizontal: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    height: 67,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C9ADA7',
  },
  addIcon: {
    width: 25,
    height: 25,
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
    color: '#FFFFFF',
  },
  listLine: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#22223B',
  },
  noDataText: {
    fontFamily: 'Poppins',
    alignSelf: 'center',
    marginTop: 100,
    fontSize: 16,
    fontWeight: 300,
    position: 'absolute',
    color: '#4A4E69'
  },
  card: {
    width: '100%',
    height: 215,
    backgroundColor: '#EBEEFF',
    justifyContent: 'space-between',
  },
  listView: {
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listDatas: {
    width: 214,
    height: 195,
  },
  name: {
    fontSize: 20,
    color: '#22223B',
    fontFamily: 'Poppins',
    marginBottom: 10,
    fontWeight: '400',
  },
  city: {
    fontSize: 14,
    color: '#22223B',
    fontFamily: 'Poppins',
    marginBottom: 10,
    fontWeight: '400',
  },
  address: {
    fontSize: 14,
    color: '#22223B',
    fontFamily: 'Poppins',
    marginBottom: 10,
    fontWeight: '400',
  },
  machine: {
    fontSize: 14,
    color: '#22223B',
    fontFamily: 'Poppins',
    marginBottom: 10,
    fontWeight: '400',
  },
  mobile: {
    fontSize: 14,
    color: '#22223B',
    fontFamily: 'Quantico',
    fontWeight: '400',
  },
  listIcons: {
    width: 101,
    height: 27,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  addToTask: {
    width: 101,
    height: 30,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#22223B'

  },
  addToTaskText: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 12,
    color: '#22223B',
  }
});
