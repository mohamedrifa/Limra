import React, { useState, useEffect} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Keyboard, Image, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { Linking } from 'react-native';
import ServiceCard from '../../component/services/ServiceCard';
import TopBar from '../../component/services/TopBar';
import AddCustomerModal from '../../component/services/AddCustomerModal';
import HistoryModal from '../../component/services/HistoryModal';
import { fetchServices, addToTask } from '../../api/serviceApi';

export default function ServiceAdd({ navigateToCustomerAdd, navigateToMessages, AddCustomer, navigateToHistory, history}){
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [customerId, setCustomerId] = useState("");
  const [mobile, setMobile] = useState();
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dates = Array.from({ length: 30 }, (_, i) =>
    moment().add(-i, 'days').format('YYYY-MM-DD')
  );
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchServices(setCustomers);
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
  
  const searchHandler = async () => {
    if(searchActive === false){
      setSearchActive(true);
    }
  };
  
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
  highlight: {
    backgroundColor: '#F3FF00',
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
