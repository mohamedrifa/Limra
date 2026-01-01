import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, BackHandler, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { Services } from '../constants/varConst';
import BillGenerator from '../component/serviceAdd/BillGenerator';
import MobileSuggestion from '../component/mobileSuggestion';
import CustomPicker from '../component/customPicker';
import { fetchServiceById, saveCustomerService } from "../api/serviceApi";
import BillTable from '../component/serviceAdd/BillTable';

export default function AddCustomer({ navigateToServiceAdd, customerId }) {
  console.log(customerId);
  const [customer, setCustomer] = useState({ name: '', mobile: '', date: moment(selectedDate).format('YYYY-MM-DD'), city: '', serviceType: 'Select type', address: '' });
  const [billItems, setBillItems] = useState([{ id: 1, particulars: '', rate: '', qty: '1', total: '0.00', originalPrice: '', commission: '0.00' }]);
  const [billTotals, setBillTotals] = useState({ customTotal: '0.00', ogTotal: '0.00', commisionTotal: '0.00'});
  
  const [isSaved, setIsSaved] = useState(false);

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [showSuggestion, setShowSuggestion] = useState(false);
  
  const options = Services;

  useEffect(() => {
    const backAction = () => {
      navigateToServiceAdd();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigateToServiceAdd]);

  useEffect(() => {
    if (!customerId) return;
    const unsubscribe = fetchServiceById(customerId, (data) => {
      if (!data) return;
      setCustomer(data);
      if (data.billItems) {
        setBillItems(data.billItems);
        setIsSaved(true);
      }
      if (data.billTotals) {
        setBillTotals(data.billTotals);
      }
    });
    return () => unsubscribe();
  }, [customerId]);

  const handleAddRow = () => {
    const lastItem = billItems[billItems.length - 1];
    if (!lastItem.particulars.trim() && !lastItem.rate.trim() && !lastItem.originalPrice.trim()) {
      alert('Fill any Column in Previous');
      return;
    }
    setBillItems([...billItems, { id: billItems.length + 1, particulars: '', rate: '', qty: '1', total: '0.00', originalPrice: '', commission: '0.00' }
    ]);
  };
  const handleInputChange = (index, field, value) => {
    const updatedBillItems = [...billItems];
    const updatedBillTotals = billTotals;
    updatedBillItems[index][field] = value;
    const rate = parseFloat(updatedBillItems[index]['rate']) || 0;
    let qty = parseFloat(updatedBillItems[index]['qty']) || 0;
    if (isNaN(qty) || qty <= 0) { qty = 1; }
    updatedBillItems[index]['total'] = (rate * qty).toFixed(2);
    updatedBillItems[index]['commission'] = (updatedBillItems[index]['total'] - updatedBillItems[index]['originalPrice']).toFixed(2);
    updatedBillTotals.customTotal = billItems.reduce((sum, item) => sum + parseFloat(item.total || 0), 0).toFixed(2);
    updatedBillTotals.ogTotal = billItems.reduce((sum, item) => sum + parseFloat(item.originalPrice || 0), 0).toFixed(2);
    updatedBillTotals.commisionTotal = billItems.reduce((sum, item) => sum + parseFloat(item.commission || 0), 0).toFixed(2);
    setBillTotals(updatedBillTotals);
    setBillItems(updatedBillItems);
  };

  const ogChange = (index, field, value) => {
    const updatedBillItems = [...billItems];
    updatedBillItems[index][field] = value;
    if(updatedBillItems[index]['total']<0){
      updatedBillItems[index]['originalPrice'] = 0.00;
    } else {
      updatedBillItems[index]['originalPrice'] = updatedBillItems[index]['total'];
    }
    updatedBillItems[index]['commission'] = (updatedBillItems[index]['total'] - updatedBillItems[index]['originalPrice']).toFixed(2);
    setBillItems(updatedBillItems);
    handleInputChange(index, field, value);
  };

  const handleSubmit = () => {
    saveCustomerService({
      customer,
      customerId,
      billItems,
      billTotals,
      setBillItems,
      setIsSaved,
      setShowSuggestion,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={navigateToServiceAdd}>
          <View style={styles.backIcon}><Image source={require("../assets/vectors/arrowBack.png")} style={{ height:16,width:8}}/></View>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style = {styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={{width: '100%',marginTop: 15, alignSelf: 'center', paddingLeft: 16, paddingRight: 16}}>
          <Text style={styles.promtText} >Name</Text>
          <TextInput style={styles.input} value={customer.name|| ''} onChangeText={(text) => setCustomer({ ...customer, name: text })} onFocus={()=>setShowSuggestion(false)}/>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '48%'}}>
              <Text style={styles.promtText} >Mobile No.</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={customer.mobile|| ''} onChangeText={(text) => {setCustomer({ ...customer, mobile: text }), setShowSuggestion(true)}}/>
              <View>
                <MobileSuggestion
                  visible={showSuggestion && customer.mobile !== ''}
                  customer={customer}
                  setCustomer={(item)=>{setCustomer(item); setShowSuggestion(false);}}
                />
              </View>
            </View>
            <View style={{width: '48%'}}>
              <Text style={styles.promtText}>Date</Text>
              <View style={[styles.input, {paddingLeft: 16, paddingRight: 16 }]}>
                <TouchableOpacity onPress={() => {setOpen(true);setShowSuggestion(false);}} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Image source={require('../assets/vectors/calender.png')} style={{width: 16, height: 16, resizeMode: 'cover', alignSelf: 'center'}} />
                  <DatePicker
                    modal
                    open={open}
                    date={date}
                    mode="date" // Can be 'date', 'time', or 'datetime'
                    onConfirm={(selectedDate) => {
                      setOpen(false);
                      setDate(selectedDate);
                      setCustomer({ ...customer, date: moment(selectedDate).format('YYYY-MM-DD') });
                    }}
                    onCancel={() => setOpen(false)}
                  />
                  <Text style={{fontSize: 16, color: '#4A4E69'}}>{customer.date}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text style={styles.promtText}>City</Text>
          <TextInput style={styles.input} value={customer.city|| ''} onFocus={()=>setShowSuggestion(false)} onChangeText={(text) => setCustomer({ ...customer, city: text })}/>
          <Text style={[styles.promtText, {marginBottom: 10}]}>Service Type</Text>
          <CustomPicker 
            data={options} 
            onFocus={()=>setShowSuggestion(false)}
            serviceType={customer.serviceType || "Service type"}
            sendService={(itemValue) => setCustomer({ ...customer, serviceType: itemValue })}
            toCloseSuggestion={setShowSuggestion}
          />
          <Text style={styles.promtText}>Address/Notes</Text>
          <TextInput style={[styles.input, { height: 105, textAlignVertical: 'top' }]} onFocus={()=>setShowSuggestion(false)} multiline={true} scrollEnabled={true} numberOfLines={4} value={customer.address|| ''} onChangeText={(text) => setCustomer({ ...customer, address: text })}/>
          <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
            <Text style={styles.promtText}>customer bill</Text>
            {isSaved&&(
            <View style={{flex: 1, flexDirection: 'row', marginLeft: 10}}>
              <BillGenerator customerId={customerId} customer={customer} billItems={billItems} billTotals={billTotals}/>
            </View>)}
          </View>
          <BillTable
            billItems={billItems}
            billTotals={billTotals}
            handleInputChange={handleInputChange}
            ogChange={ogChange}
            setShowSuggestion={setShowSuggestion}
            handleAddRow={handleAddRow}
          />
        </View>
        <View style={{height: 80}}/>
      </ScrollView>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Image style={styles.submitImage} source={require('../assets/vectors/SaveButton.png')}/>
      </TouchableOpacity>
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
    height: 47,
    borderColor: '#22223B',
    paddingHorizontal: 16,
    color: '#4A4E69',
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    textDecorationColor: '#EBEEFF',
    position: 'relative'
  },
  pickerCustomIcon: {
    flexDirection: 'row', 
    position: 'absolute', 
    right: 16, 
    left: 6, 
    top: 5, 
    bottom: 5, 
    alignItems: 'center',
    justifyContent: 'space-between', 
    backgroundColor: '#EBEEFF', 
    pointerEvents: 'none', 
  },
  submitButton: {
    position: 'absolute',
    bottom: 22,
    right: 22,
    height: 43,
    width: 100,
    borderRadius: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  submitImage: {
    height: 43,
    width: 100,
    resizeMode: 'contain',
  },
});
