import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { ref, onValue } from 'firebase/database';
import LinearGradient from 'react-native-linear-gradient';
import { database } from '../../../firebase';
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
      ListFooterComponent={<View style={{height: 129}} />}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={{flex:1, justifyContent: 'center'}}>
            <Text style={styles.name}>{highlightText(item.name, searchQuery)}</Text>
            <Text style={styles.mobile}>{highlightText(item.mobile, searchQuery)}</Text>
          </View>
          <TouchableOpacity>
            <Image source={require('../../assets/vectors/plusViolet.png')} style={{width: 22, height: 22, resizeMode: 'contain'}}/>
          </TouchableOpacity>
        </View>
      )}/>
      <LinearGradient
        colors={['#342F33', '#9A8C98']}
        style={{width: '100%', height: 52, position: 'absolute',paddingHorizontal: 17, bottom: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <Text style={styles.counterText}>1 profile selected</Text>
        <TouchableOpacity style={styles.sendButton}>
          <LinearGradient
            colors={['#22223B', '#5D5DA1']}
            style={styles.sendButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <Text style={styles.counterText}>Send</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
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
  }
});

export default Messages;