import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ScrollView, Image } from 'react-native';
import { getDatabase, ref , onValue } from "firebase/database";

export default function sample({ navigateToServiceAdd, customerId }) {
    const [customer, setCustomer] = useState({ name: '', mobile: '', date: '', city: '', serviceType: 'Select Service', address: '' });
    const [billItems, setBillItems] = useState([{ id: 1, particulars: '', rate: '', qty: '1', total: '0.00', originalPrice: '', commission: '0.00' }]);
    const [billTotals, setBillTotals] = useState([{ customTotal: '0.00', ogTotal: '0.00', commisionTotal: '0.00'}]);

    useEffect(() => {
        if (!customerId) return;
        const db = getDatabase();
        const customerRef = ref(db, `/Customers/${customerId}`);
        const unsubscribe = onValue(customerRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setCustomer(data);
            if (data.billItems) {
              setBillItems(data.billItems);
              setIsSaved(true);
            }
            if (data.billTotals) {
              setBillTotals(data.billTotals);
            }
          }
        });
        return () => unsubscribe(); 
      }, [customerId]);




  return(
  <ScrollView horizontal style={{flex: 1}}>
  <View style={styles.container}>
    <Image source={require('../assets/images/LIMRA.png')} style={styles.title}/>
    <View style={styles.customerDetails}>
        <Text style={[styles.customerData, {fontSize: 20}]}>{customer.name}</Text>
        <Text style={[styles.customerData, {fontSize: 14}]}>{customer.city}</Text>
        <Text style={[styles.customerData, {fontSize: 14}]}>{customer.address}</Text>
        <Text style={[styles.customerData, {fontSize: 14}]}>{customer.serviceType}</Text>
        <Text style={{fontSize: 14, fontFamily: 'Quantico',fontWeight: 400, color: '#22223B'}}>{customer.mobile}</Text>
    </View>
    <View style={styles.tableHorizontalLine1}/>
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style={styles.tableVerticalLine1}/>
      <View style={styles.tableSNo}><Text style={styles.headerText}>S.NO</Text></View>
      <View style={styles.tableVerticalLine1}/>
      <View style={styles.tableParticulars}><Text style={styles.headerText}>Particulars</Text></View>
      <View style={styles.tableVerticalLine1}/>
      <View style={styles.tableRate}><Text style={styles.headerText}>Rate</Text></View>
      <View style={styles.tableVerticalLine1}/>
      <View style={styles.tableQty}><Text style={styles.headerText}>Qty</Text></View>
      <View style={styles.tableVerticalLine1}/>
      <View style={styles.tableTotal}><Text style={styles.headerText}>Total</Text></View>
      <View style={styles.tableVerticalLine1}/>
    </View>
    <View style={styles.tableHorizontalLine1}/>
    <FlatList
    data={billItems}
    keyExtractor={(item) => item.id.toString()}
    ListFooterComponent={
        <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={styles.tableVerticalLine1}/>
                <View style={styles.overallTotal}><Text style={styles.headerText}>Total</Text></View>
                <View style={styles.tableVerticalLine1}/>
                <View style={styles.tableTotal}><Text style={[styles.inputText,{textAlign: 'right'}]}>{billTotals[0].customTotal}</Text></View>
                <View style={styles.tableVerticalLine1}/>
            </View>
            <View style={styles.tableHorizontalLine1}/>
            <View style={styles.technicianView}>
                <Text style={styles.technicianName}>Shahathul Ameen</Text>
                <Text style={styles.technicianNo}>9092443584</Text>
                <Text style={styles.technicianAddress}>Bharathi Street, Kuttalam</Text>
            </View>
            <Text style={styles.servicesPassage}>AC/Washing Machine/Refrigerator/Microwave/water Purifier & All Brand Services</Text>
        </View>
    }
    renderItem={({ item, index }) => (
    <View style={{flexDirection:'column'}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={styles.tableVerticalLine1}/>
        <View style={styles.tableSNo}><Text style={styles.headerText}>{item.id}</Text></View>
        <View style={styles.tableVerticalLine1}/>
        <View style={styles.tableParticulars}><Text style={styles.inputText} >{item.particulars}</Text></View>
        <View style={styles.tableVerticalLine1}/>
        <View style={styles.tableRate}><Text style={[styles.inputText,{textAlign: 'center'}]}>{item.rate}</Text></View>
        <View style={styles.tableVerticalLine1}/>
        <View style={styles.tableQty}><TextInput style={[styles.inputText,{textAlign: 'center'}]}>{item.qty}</TextInput></View>
        <View style={styles.tableVerticalLine1}/>
        <View style={styles.tableTotal}><Text style={[styles.inputText,{textAlign: 'right'}]}>{item.total}</Text></View>
        <View style={styles.tableVerticalLine1}/>
      </View>
      <View style={styles.tableHorizontalLine1}/>
    </View>
    )}
    />
  </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 595,
    height: 842,
    paddingBottom: 37,
    paddingTop: 37,
    paddingLeft: 57,
    paddingRight: 57
  },
  title: {
    width: 76,
    height: 33,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  customerDetails: {
    width: 466,
    marginTop: 20,
    marginBottom: 20,
  },
  customerData: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    color: '#22223B'
  },



  tableHorizontalLine1:{
    width: '100%',
    height: 1, 
    backgroundColor: '#22223B'
  },
  tableVerticalLine1: {
    height: 38,
    width: 1,
    backgroundColor: '#22223B',
  },
  tableSNo: {
    width: 40,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableParticulars: {
    width: 206,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableRate: {
    width: 82,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableQty: {
    width: 50,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableTotal: {
    width: 82,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 14,
    color: '#22223B'
  },
  inputText: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    height: 40,
    textAlignVertical: 'center',
    width: '100%',
    color: '#22223B',
  },
  overallTotal: {
    height: 38,
    width: 390,
    alignItems: 'center',
    justifyContent: 'center',
  },
  technicianView: {
    width: 209,
    height: 96,
    marginTop: 42,
    justifyContent: 'space-between'
  },
  technicianName: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: 400,
    color: '#22223B',
  },
  technicianNo: {
    fontFamily: 'Quantico',
    fontSize: 14,
    fontWeight: 400,
    color: '#22223B',
  },
  technicianAddress: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: 400,
    color: '#22223B',
  },
  servicesPassage: {
    width: 466,
    height: 48,
    marginTop: 11,
    color: '#22223B',
    alignSelf: 'center',
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 16,
    textAlign: 'center'
  }

});
