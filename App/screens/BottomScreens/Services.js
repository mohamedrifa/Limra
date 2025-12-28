import React, { useState, useEffect} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Keyboard, Image, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { getDatabase, ref, onValue, set, get, update} from 'firebase/database';
import { database } from '../../../firebase';
import { Linking } from 'react-native';
import ServiceCard from '../../component/services/ServiceCard';
import TopBar from '../../component/services/TopBar';
import AddCustomerModal from '../../component/services/AddCustomerModal';
import HistoryModal from '../../component/services/HistoryModal';

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
      const snapshot = await get(customerRef);
      if (!snapshot.exists()) return;
      const taskRef = ref(db, "Tasks/overallTasks");
      const overallSnapshot = await get(taskRef);
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
        <TopBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchHandler={searchHandler}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          searchActive={searchActive}
          setSearchActive={setSearchActive}
          dates={dates}
          open={open}
          setOpen={setOpen}
          date={date}
          setDate={setDate}
        />
        <View style={styles.serviceListContainer}>
          <Text style={styles.noDataText}>No Entries</Text>
          {!searchActive && (
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
          )}
          <FlatList
            data={searchActive ? filteredCustomers : customers}
            style={{ marginTop: 10 }}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{height: 77}} />}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ServiceCard
                item={item}
                selectedDate={selectedDate}
                searchActive={searchActive}
                searchQuery={searchQuery}
                highlightText={highlightText}
                editCustomer={editCustomer}
                customerHistory={customerHistory}
                openDialPad={openDialPad}
                openWhatsApp={openWhatsApp}
                addToTask={addToTask}
              />
            )}
          />
        </View>
      </View>
      <AddCustomerModal
        visible={AddCustomer}
        navigateBack={()=>navigateBack()}
        customerId={customerId}
      />
      <HistoryModal
        visible={history}
        navigateBack={()=>navigateBack()}
        mobile={mobile}
      />
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
  noDataText: {
    fontFamily: 'Poppins',
    alignSelf: 'center',
    marginTop: 100,
    fontSize: 16,
    fontWeight: 300,
    position: 'absolute',
    color: '#4A4E69'
  },
});
