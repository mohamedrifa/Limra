import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { ref, onValue } from 'firebase/database';
import LinearGradient from 'react-native-linear-gradient';
import { database } from '../../../firebase';
import { Linking } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';


const Messages = () => {
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

  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const addToList = (mobile) => {
    if (!selectedNumbers.includes(mobile)) {
      setSelectedNumbers([...selectedNumbers, mobile]);
    }
    else{
      setSelectedNumbers(selectedNumbers.filter(item => item !== mobile));
    }
  };
  const [message, setMessage] = useState(null);
  const sendWhatsAppMessage = async () => {
    if(message === null || message ===''){
      return null;
    } else{
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
  };
  const [toSend, setToSend] = useState(false);
  return(
  <View style={styles.container}>
    <Text style={styles.topText}>Connect With Customers</Text>
    <Text style={styles.secondText}>Message To All In One Place</Text>
    <View style={{width: '100%', paddingHorizontal:18, marginTop: 19}}>
      <View style={styles.searchView}>
        <TextInput 
        placeholder='search profiles' 
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar} 
        placeholderTextColor={'#4A4E69'}/>
        <TouchableOpacity style={{width: 30, height: 30, alignSelf: 'center'}}>
          <Image source={require('../../assets/vectors/search.png')} style={{width: 30, height: 30, resizeMode: 'contain'}}/>
        </TouchableOpacity>
      </View>
    </View>
    <FlatList
      data={filteredCustomers||customers}
      style={{ marginTop: 5 }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={<View style={{width: '100%', height: 0.25, backgroundColor: '#22223B'}}/>}
      ListFooterComponent={selectedNumbers.length>0 ? (<View style={{height: 129}} />):(<View style={{height: 77}} />)}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View 
          style={[
            styles.card, 
            selectedNumbers.includes(item.mobile) && { backgroundColor: '#FFFFFF' }]}
        >
          <View style={{flex:1, justifyContent: 'center'}}>
            <Text style={styles.name}>{highlightText(item.name, searchQuery)}</Text>
            <Text style={styles.mobile}>{highlightText(item.mobile, searchQuery)}</Text>
          </View>
          <TouchableOpacity onPress={() => addToList(item.mobile)}>
            {
              selectedNumbers.includes(item.mobile) ? (
                <Image source={require('../../assets/vectors/tickViolet.png')} style={{width: 22, height: 22, resizeMode: 'contain'}}/>
              ):(
                <Image source={require('../../assets/vectors/plusViolet.png')} style={{width: 22, height: 22, resizeMode: 'contain'}}/>
              )
            }
          </TouchableOpacity>
        </View>
      )}/>
      { selectedNumbers.length>0 ? (
          <LinearGradient
            colors={['#342F33', '#9A8C98']}
            style={{width: '100%', height: 52, position: 'absolute',paddingHorizontal: 17, bottom: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <Text style={styles.counterText}>{selectedNumbers.length} profile selected</Text>
            <TouchableOpacity style={styles.sendButton} onPress={() => setToSend(true)}>
              <LinearGradient
                colors={['#22223B', '#5D5DA1']}
                style={styles.sendButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <Text style={styles.counterText}>Send</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        ): null}

        { toSend && (
          <View style={styles.blurView} >
            <View style={styles.sendTaskContainer}>
              <TextInput 
              style={styles.input} 
              placeholder='Enter Your Message Here'
              scrollEnabled={true}
              value={message}
              onChangeText={setMessage}
              placeholderTextColor={'#4A4E69'}
              multiline={true}
              />
              <View style={{flex: 1, flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center', paddingHorizontal: 10,}}>
                <TouchableOpacity style={[styles.sendConfirmButton, {borderWidth: 1}]} onPress={()=>setToSend(false)}>
                  <Text style={[styles.delConfirmText, {color: '#22223B'}]}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendConfirmButton} onPress={()=> {sendWhatsAppMessage()}}>
                  <LinearGradient
                    colors={['#22223B', '#5D5DA1']}
                    style={[styles.sendConfirmButton, {width: '100%'}]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}>
                    <Text style={[styles.delConfirmText, {color: '#FFFFFF'}]}>Send</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>) 
        }
      
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#EBEEFF',
  },
  topText: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 24,
    color: '#4A4E69',
    marginTop: 43,
  },
  secondText: {
    fontFamily: 'Poppins',
    fontWeight: 300,
    fontSize: 20,
    color: '#4A4E69',
    marginTop: 43,
    marginTop: 5,
  },
  searchView: {
    width: '100%',
    height: 43,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#22223B',
    paddingHorizontal: 10,
    flexDirection: 'row'
  },
  searchBar: {
    flex: 1,
    color: 'black'
  },
  highlight: {
    backgroundColor: '#F3FF00',
  },
  card: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 17,
    borderBottomWidth: 0.25,
    borderBottomColor: '#22223B'
  },
  name :{
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 20,
  },
  mobile: {
    fontFamily: 'Quantico',
    fontWeight: 400,
    marginTop: 10,
    fontSize: 14,
  },
  counterText: {
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
  blurView: {
    borderRadius: 5,
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#00000099',
  },
  sendTaskContainer: {
    width: '90%',
    height: 300,
    position: 'absolute',
    bottom: 140,
    padding: 16,
    backgroundColor: '#EBEEFF',
    borderRadius: 5,
  },
  sendConfirmButton: {
    width: '48%',
    height: 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBEEFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    width: '100%',
    height: '80%',
    borderColor: '#22223B',
    color: '#4A4E69',
    fontFamily: 'Poppins',
    paddingHorizontal: 16,
    fontWeight: 400,
    textAlignVertical: 'top',
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 19,
  },
});

export default Messages;