import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, BackHandler, TouchableOpacity, FlatList, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { listenCustomersByMobile } from '../api/serviceApi';
import CustomerTimelineItem from '../component/history/CustomerTimelineItem';
import AddCustomerModal from '../component/services/AddCustomerModal';

export default function CustomerHistory({mobile, navigateToServiceAdd}){

  const [customers, setCustomers] = useState([]);
  const [addCustomerPage, setAddCustomerPage] = useState(false);
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    if (!mobile) return;
    const unsubscribe = listenCustomersByMobile(mobile, setCustomers);
    return () => unsubscribe();
  }, [mobile]);

  useEffect(() => {
    const backAction = () => {
      navigateToServiceAdd();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigateToServiceAdd]);

  
  const customerAdd = async (Id) => {
    setCustomerId(Id);
    setAddCustomerPage(true);
  };
  const navigateBack = async () => {
    setCustomerId("");
    setAddCustomerPage(false);
  };

  
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
        ListFooterComponent={<View style={{ height: 30 }} />}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <CustomerTimelineItem
            item={item}
            index={index}
            customers={customers}
            onPress={customerAdd}
          />
        )}
      />
      <AddCustomerModal
        visible={addCustomerPage}
        navigateBack={()=>navigateBack()}
        customerId={customerId}
      />
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
});


