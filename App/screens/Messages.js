import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, BackHandler, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Linking } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { fetchMergedCustomer } from '../api/serviceApi';
import CustomerList from '../component/messages/CustomerList';
import SendMessageModal from '../component/messages/SendMessageModal';

export default function Messages({navigateToServiceAdd} ){
  const [customers, setCustomers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toWhatsapp, setToWhatsapp] = useState(true);
  const [message, setMessage] = useState(null);
  const [toSend, setToSend] = useState(false);

  useEffect(() => {
    const unsubscribe = fetchMergedCustomer(setCustomers);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigateToServiceAdd();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigateToServiceAdd]);
  
  
  const toggleSwitch = () => setToWhatsapp(previousState => !previousState);
  
  const filteredCustomers = customers.filter(item =>
    (item.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (item.city?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (item.address?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (item.mobile || "").includes(searchQuery)
  );

  const highlightText = (text, searchQuery) => {
    if (!text || !searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    if (searchQuery!=='' || searchQuery !== null){
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

  const addToList = (mobile) => {
    if (!selectedNumbers.includes(mobile)) {
      setSelectedNumbers([...selectedNumbers, mobile]);
    }
    else{
      setSelectedNumbers(selectedNumbers.filter(item => item !== mobile));
    }
  };
  
  const sendWhatsAppMessage = async () => {
    if(message === null || message ===''){
      return null;
    } 
    else if (toWhatsapp) {
      for (let i = 0; i < selectedNumbers.length; i++) {
        const number = selectedNumbers[i];
        const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
        try {
          await new Promise((resolve) => {
            Linking.openURL(whatsappUrl).catch(() => {
              Alert.alert("Error", "Unable to open WhatsApp for " + number);
            });
            setTimeout(resolve, 4000); // 5 seconds delay
          });
        } catch (error) {
          console.error("Error processing number:", number, error);
        }
      }
    }
    else {
      for (let i = 0; i < selectedNumbers.length; i++) {
        const number = selectedNumbers[i];
        const smsUrl = `sms:${number}?body=${encodeURIComponent(message)}`;
        try {
          await new Promise((resolve) => {
            Linking.openURL(smsUrl).catch(() => {
              Alert.alert("Error", "Unable to open SMS for " + number);
            });
            setTimeout(resolve, 4000); // 5 seconds delay
          });
        } catch (error) {
          console.error("Error processing number:", number, error);
        }
      }
    }
  };
  
  return(
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 48, marginLeft: 17}}>
          <TouchableOpacity
          style={{
            width: 35,
            height: 35,
            borderRadius: 100,
            backgroundColor: '#C9ADA7',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={navigateToServiceAdd}
          >
            <Image source={require('../assets/vectors/arrowBack.png')} style={{ width: 10, height: 18}}/>
          </TouchableOpacity>
          <Text
          style={{
            fontFamily: 'Poppins-SemiBold',
            color: '#4A4E69',
            fontSize: 16,
            marginLeft: 14,
          }}
          >Group Message</Text>
        </View>
      </View>
      <Text style={styles.topText}>Connect With Customers</Text>
      <Text style={styles.secondText}>Message To All In One Place</Text>
      <View style={{width: '100%', paddingHorizontal:18, marginTop: 8}}>
        <View style={styles.searchView}>
          <TextInput 
          placeholder='search profiles' 
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar} 
          placeholderTextColor={'#4A4E69'}/>
          <TouchableOpacity style={{width: 30, height: 30, alignSelf: 'center'}}>
            <Image source={require('../assets/vectors/search1.png')} style={{width: 30, height: 30, resizeMode: 'contain'}}/>
          </TouchableOpacity>
        </View>
      </View>
      <CustomerList
        customers={customers}
        filteredCustomers={filteredCustomers}
        selectedNumbers={selectedNumbers}
        addToList={addToList}
        highlightText={highlightText}
        searchQuery={searchQuery}
      />
      { selectedNumbers.length>0 ? (
        <LinearGradient
          colors={['#F9FBFFCF', '#F9FBFF']}
          style={{width: '100%', height: 70, position: 'absolute',paddingHorizontal: 17, bottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}>
          <Text style={styles.counterText}>{selectedNumbers.length} profile selected</Text>
          <TouchableOpacity style={styles.sendButton} onPress={() => setToSend(true)}>
            <LinearGradient
              colors={['#22223B', '#5D5DA1']}
              style={styles.sendButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text style={styles.counterButtonText}>Send</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>): null
      }
      <SendMessageModal
        visible={toSend}
        toWhatsapp={toWhatsapp}
        toggleSwitch={toggleSwitch}
        message={message}
        setMessage={setMessage}
        selectedNumbers={selectedNumbers}
        onCancel={() => setToSend(false)}
        onSend={sendWhatsAppMessage}
      />   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#EBEEFF',
  },
  topBar: {
    width: '100%',
    height: 97,
    borderBottomColor: '#4A4E69',
    borderBottomWidth: 1,
  },
  topText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#4A4E69',
    marginTop: 8,
  },
  secondText: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 14,
    color: '#4A4E69',
    marginTop: 8,
  },
  searchView: {
    width: '100%',
    height: 43,
    borderRadius: 5,
    borderWidth: 0.25,
    borderColor: '#22223B',
    paddingHorizontal: 10,
    flexDirection: 'row'
  },
  searchBar: {
    flex: 1,
    color: 'black'
  },
  counterText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
    fontWeight: 400,
    color: '#22223B'
  },
  counterButtonText: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: 400,
    color: '#FFFFFF'
  },
  sendButton: {
    width: 100,
    height: 43,
    borderRadius: 30,
    alignItems:'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  
  highlight: {
    backgroundColor: '#F3FF00',
  },
});