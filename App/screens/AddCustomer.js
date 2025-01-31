import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, BackHandler, TouchableOpacity, TextInput, FlatList, ScrollView, Image } from 'react-native';
import { database } from '../../firebase';
import { getDatabase, ref, set } from "firebase/database";

export default function AddCustomer({ navigateToServiceAdd, customerId }) {

  const [customer, setCustomer] = useState({ name: '', mobile: '', date: '', city: '', serviceType: '', address: '' });
  const [billItems, setBillItems] = useState([{ id: 1, particulars: '', rate: '', qty: '', total: '', originalPrice: '', commission: '' }]);

  useEffect(() => {
    const backAction = () => {
      navigateToServiceAdd();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigateToServiceAdd]);

  const handleAddRow = () => {
    setBillItems([...billItems, { id: billItems.length + 1, particulars: '', rate: '', qty: '', total: '', originalPrice: '', commission: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedBillItems = [...billItems];
    updatedBillItems[index][field] = value;
    const rate = parseFloat(updatedBillItems[index]['rate']) || 0;
    const qty = parseFloat(updatedBillItems[index]['qty']) || 0;
    updatedBillItems[index]['total'] = (rate * qty).toFixed(2);
    updatedBillItems[index]['commission'] = (updatedBillItems[index]['total'] - updatedBillItems[index]['originalPrice']).toFixed(2);
    setBillItems(updatedBillItems);
  };
  
  const handleSubmit = () => {
    const db = getDatabase();
    set(ref(db, `/Customers/${customerId}`), { ...customer, billItems })
      .then(() => alert('Customer details saved!'))
      .catch((error) => alert(`Error: ${error.message}`));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={navigateToServiceAdd}>
          <View style={styles.backIcon}><Image source={require("../assets/vectors/arrowBack.png")} style={{ height:16,width:8}}/></View>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style = {styles.scrollView}>
        <View style={{width: 328,marginTop: 15, alignSelf: 'center'}}>
          <Text style={styles.promtText} >Name</Text>
          <TextInput style={styles.input} value={customer.name} onChangeText={(text) => setCustomer({ ...customer, name: text })} />
          <View style={{flexDirection: 'row'}}>
            <View style={{width: 154}}>
              <Text style={styles.promtText} >Mobile No.</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={customer.mobile} onChangeText={(text) => setCustomer({ ...customer, mobile: text })}/>
            </View>
            <View style={{width: 154, marginLeft: 20}}>
              <Text style={styles.promtText}>Date</Text>
              <TextInput style={styles.input} value={customer.date} onChangeText={(text) => setCustomer({ ...customer, date: text })}/>
            </View>
          </View>
          <Text style={styles.promtText}>city</Text>
          <TextInput style={styles.input} value={customer.city} onChangeText={(text) => setCustomer({ ...customer, city: text })}/>
          <Text style={styles.promtText}>Service Type</Text>
          <TextInput style={styles.input} value={customer.serviceType} onChangeText={(text) => setCustomer({ ...customer, serviceType: text })}/>
          <Text style={styles.promtText}>Address/Notes</Text>
          <TextInput style={[styles.input, { height: 105, textAlignVertical: 'top' }]} multiline={true} scrollEnabled={true} numberOfLines={4} value={customer.address} onChangeText={(text) => setCustomer({ ...customer, address: text })}/>
          <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
            <Text style={styles.promtText}>customer bill</Text>
            <TouchableOpacity style={styles.downloadButton}>
              <Text style={styles.downloadText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal style={{marginTop: 18}}>
            <View style={{flexDirection: 'column'}}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.tableHorizontalLine1}/>
                <View style={styles.tableHorizontalLine2}/>
              </View>
              <View style={{flexDirection: 'row'}}>
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
                <View style={styles.tableOgPrice}><Text style={styles.headerText}>Original Price</Text></View>
                <View style={styles.tableVerticalLine2}/>
                <View style={styles.tableCommision}><Text style={styles.headerText}>Commision</Text></View>
                <View style={styles.tableVerticalLine2}/>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.tableHorizontalLine1}/>
                <View style={styles.tableHorizontalLine2}/>
              </View>
              <FlatList
                data={billItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                <View style={{flexDirection:'column'}}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.tableVerticalLine1}/>
                    <View style={styles.tableSNo}><Text style={styles.headerText}>{item.id}</Text></View>
                    <View style={styles.tableVerticalLine1}/>
                    <View style={styles.tableParticulars}><TextInput style={styles.billInput} value={item.particulars} onChangeText={(text) => handleInputChange(index, 'particulars', text)} /></View>
                    <View style={styles.tableVerticalLine1}/>
                    <View style={styles.tableRate}><TextInput style={styles.billInput} keyboardType="numeric" value={item.rate} onChangeText={(text) => handleInputChange(index, 'rate', text)} /></View>
                    <View style={styles.tableVerticalLine1}/>
                    <View style={styles.tableQty}><TextInput style={styles.billInput} keyboardType="numeric" value={item.qty} onChangeText={(text) => handleInputChange(index, 'qty', text)} /></View>
                    <View style={styles.tableVerticalLine1}/>
                    <View style={styles.tableTotal}><TextInput style={styles.billInput} value={item.total} onChangeText={(text) => handleInputChange(index, 'total', text)} /></View>
                    <View style={styles.tableVerticalLine1}/>
                    <View style={styles.tableOgPrice}><TextInput style={styles.billInput} value={item.originalPrice} onChangeText={(text) => handleInputChange(index, 'originalPrice', text)} /></View>
                    <View style={styles.tableVerticalLine2}/>
                    <View style={styles.tableCommision}><TextInput style={styles.billInput} value={item.commission} onChangeText={(text) => handleInputChange(index, 'commision', text)} /></View>
                    <View style={styles.tableVerticalLine2}/>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.tableHorizontalLine1}/>
                    <View style={styles.tableHorizontalLine2}/>
                  </View>
                </View>
                )}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddRow}>
                <Text style={styles.addButtonText}>+ Add More Row</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEEFF'
  },
  topBar:{
    width:'100%',
    height: 100,
    backgroundColor: '#EBEBFF',
    borderColor: '#22223B',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 0.5
  },
  backButton: {
    width: 131,
    height: 46,
    marginTop: 32,
    marginLeft: 16,
    backgroundColor: '#FFFFFF',
    borderColor: '#22223B',
    borderWidth: 1,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  backIcon: {
    width: 28,
    height: 28,
    backgroundColor: '#C9ADA7',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    marginLeft: 20,
    height: 36,
    fontFamily: 'Poppins',
    fontSize: 24,
    color: '#22223B',
    fontWeight: 400,
  },
  scrollView: {
    flex: 1,
  },
  promtText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    marginTop: 10,
    fontWeight: 600,
    color: '#4A4E69'
  },
  input: {
    height: 43,
    borderColor: '#22223B',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 10,
  },
  downloadButton: {
    width: 93,
    height: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#22223B',
    marginTop: 10,
  },
  downloadText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: 600,
    color: '#4A4E69'
  },
  shareButton: {
    width: 116,
    height: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22223B',
    marginTop: 10,
  },
  shareText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: 600,
    color: '#FFFFFF'
  },




  tableHorizontalLine1:{
    width: 466, 
    height: 1, 
    backgroundColor: '#22223B'
  },
  tableHorizontalLine2:{
    width: 230, 
    height: 1, 
    backgroundColor: '#9A8C98'
  },
  tableVerticalLine1: {
    height: 38,
    width: 1,
    backgroundColor: '#22223B',
  },
  tableVerticalLine2: {
    height: 38,
    width: 1,
    backgroundColor: '#9A8C98',
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
  tableOgPrice: {
    width: 114,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableCommision: {
    width: 114,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 14,
    color: '#22223B'
  }



});
