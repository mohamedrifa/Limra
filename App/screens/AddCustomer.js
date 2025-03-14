import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, BackHandler, Alert, TouchableOpacity, Keyboard, TextInput, FlatList, ScrollView, Image } from 'react-native';
import { getDatabase, ref, set, onValue } from "firebase/database";
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import BillGenerator from '../component/billGenerator';
import CustomPicker from '../component/customPicker';

export default function AddCustomer({ navigateToServiceAdd, customerId }) {
  const [customer, setCustomer] = useState({ name: '', mobile: '', date: moment(selectedDate).format('YYYY-MM-DD'), city: '', serviceType: 'Select type', address: '' });
  const [billItems, setBillItems] = useState([{ id: 1, particulars: '', rate: '', qty: '1', total: '0.00', originalPrice: '', commission: '0.00' }]);
  const [billTotals, setBillTotals] = useState({ customTotal: '0.00', ogTotal: '0.00', commisionTotal: '0.00'});
  
  const [isSaved, setIsSaved] = useState(false);

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  const db = getDatabase();
  const customerRef = ref(db, `/ServiceList/${customerId}`);
  const options = ["A.C", "Washing Machine", "Refrigerator", "Microwave Oven", "RO Water Purifier", "Water Heater", "Induction Stove", "Inverter/Battery"];

  

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
    setShowSuggestion(false);
    const db = getDatabase();
    if (customer.name.trim() === '' && customer.mobile.trim() === '' && customer.city.trim() === '' &&customer.address.trim() === '') {
      alert('Please Enter All the Credentials');
      return;
    };
    if (!customer.name || customer.name.trim() === '') {
      alert('Please Enter Name');
      return;
    };
    if (!customer.mobile || customer.mobile.trim() === '') {
      alert('Please Enter Mobile No');
      return;
    }
    if (!customer.city || customer.city.trim() === '') {
      alert('Please Enter City');
      return;
    }
    if (!customer.serviceType || customer.serviceType.trim() === 'Select type') {
      alert('choose a Service type');
      return;
    }  
    if (!customer.address || customer.address.trim() === '') {
      alert('Please Enter Address/Notes');
      return;
    }    
    const lastItem = billItems[billItems.length - 1];
    if (!lastItem.particulars.trim() && !lastItem.rate.trim() && !lastItem.originalPrice.trim()) {
      setBillItems(billItems.slice(0, -1));
    }
    if(billItems[0].particulars.trim() === '' && billItems[0].rate.trim() === '' &&billItems[0].originalPrice.trim() === ''){
      set(ref(db, `/ServiceList/${customerId}`), { ...customer})
      .then(() => [alert('Success: Customer details saved!'), Keyboard.dismiss()])
      .catch((error) => alert(`Error: ${error.message}`));
    }
    else {
      set(ref(db, `/ServiceList/${customerId}`), { ...customer, billItems, billTotals })
      .then(() => [Alert.alert('Success','Customer details saved!'),setIsSaved(true), Keyboard.dismiss()])
      .catch((error) => alert(`Error: ${error.message}`));
    }
  };

  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    const customerRef = ref(db, 'ServiceList');
    const unsubscribe = onValue(customerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const mobileNumbers = Array.from(
          new Set(
            Object.keys(data)
              .filter((key) => data[key]?.mobile)
              .map((key) => data[key].mobile)
          )
        );
  
        setSuggestions(mobileNumbers);
      } else {
        setSuggestions([]);
      }
    });
  
    return () => unsubscribe();
  }, []);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const filtered = suggestions.filter(item =>
    item.toLowerCase().includes(customer.mobile.toLowerCase())
  );
  const selectedSuggestion = (mobileNo) => {
    const customerRef = ref(db, 'ServiceList');
    onValue(customerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const customerData = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .find((item) => item.mobile === mobileNo); 
        
        if (customerData) {
          customerData.id = customerId; // Assign a new unique ID
          delete customerData.billItems;
          delete customerData.billTotals;
          setCustomer({
            ...customerData,
            date: moment().format('YYYY-MM-DD'), // Update date
            serviceType: '', // Reset serviceType
          });
          setShowSuggestion(false);
        }
      }
    }, { onlyOnce: true }); // Ensures it doesn't keep listening
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
          <ScrollView horizontal style={{marginTop: 18}} showsHorizontalScrollIndicator={false}>
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
                <View style={styles.tableCommision}><Text style={styles.headerText}>Balance</Text></View>
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
                    <View style={styles.tableParticulars}><TextInput style={[styles.inputText, {width: '100%'}]} onFocus={()=>setShowSuggestion(false)} value={item.particulars|| ''} onChangeText={(text) => handleInputChange(index, 'particulars', text)} /></View>
                    <View style={styles.tableVerticalLine1}/>
                    <View style={styles.tableRate}><TextInput style={styles.inputText} onFocus={()=>setShowSuggestion(false)} value={item.rate|| ''} onChangeText={(text) => {handleInputChange(index, 'rate', text), ogChange(index, 'rate', text)}} /></View>
                    <View style={styles.tableVerticalLine1}/>
                    <View style={styles.tableQty}><TextInput style={styles.inputText} onFocus={()=>setShowSuggestion(false)} keyboardType="numeric" value={item.qty|| ''} onChangeText={(text) => handleInputChange(index, 'qty', text)} /></View>
                    <View style={styles.tableVerticalLine1}/>
                    <View style={styles.tableTotal}><Text style={[styles.inputText,{width: '100%', textAlign: 'right', marginRight: 8}]}>{item.total|| ''}</Text></View>
                    <View style={styles.tableVerticalLine1}/>
                    <View style={[styles.tableOgPrice, {alignItems: 'flex-end'}]}><TextInput style={styles.inputText} keyboardType="numeric" value={item.originalPrice|| ''} onFocus={()=>setShowSuggestion(false)} onChangeText={(text) => handleInputChange(index, 'originalPrice', text)} /></View>
                    <View style={styles.tableVerticalLine2}/>
                    <View style={styles.tableCommision}><Text style={[styles.inputText,{ width: '100%',textAlign: 'right',marginRight: 8}]}>{item.commission|| ''}</Text></View>
                    <View style={styles.tableVerticalLine2}/>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.tableHorizontalLine1}/>
                    <View style={styles.tableHorizontalLine2}/>
                  </View>
                </View>
                )}
              />
              <TouchableOpacity style={styles.addRowButton} onPress={handleAddRow}>
                <Text style={styles.addButtonText}>Add 1 more row</Text>
                <Image style={styles.addButtonIcon} source={require('../assets/vectors/plus_black.png')}/>
              </TouchableOpacity>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.tableHorizontalLine1}/>
                <View style={styles.tableHorizontalLine2}/>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.tableVerticalLine1}/>
                <View style={styles.overallTotal}><Text style={styles.headerText}>Total</Text></View>
                <View style={styles.tableVerticalLine1}/>
                <View style={styles.tableTotal}><Text style={[styles.inputText,{ width: '100%',textAlign: 'right', marginRight: 8}]}>{billTotals.customTotal}</Text></View>
                <View style={styles.tableVerticalLine1}/>
                <View style={styles.tableOgPrice}><Text style={[styles.inputText,{ width: '100%',textAlign: 'right', marginRight: 8}]}>{billTotals.ogTotal}</Text></View>
                <View style={styles.tableVerticalLine2}/>
                <View style={styles.tableCommision}><Text style={[styles.inputText,{ width: '100%',textAlign: 'right', marginRight: 8}]}>{billTotals.commisionTotal}</Text></View>
                <View style={styles.tableVerticalLine2}/>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.tableHorizontalLine1}/>
                <View style={styles.tableHorizontalLine2}/>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={{height: 80}}/>
        {(showSuggestion && customer.mobile !== '') && (
          <View style={styles.suggestionBg}>
          <FlatList
            data={filtered}
            renderItem={({ item }) => (
              <TouchableOpacity style={{padding: 2, height: 30, borderTopColor: '#808080', borderTopWidth: 0.5}} onPress={()=>selectedSuggestion(item)}>
                <Text style={{fontFamily: 'Poppins', fontSize: 16, color: '#4A4E69'}}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          </View>
        )}
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
    paddingHorizontal: 10,
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
  },
  inputText: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    height: 60,
    textAlignVertical: 'center',
    color: '#22223B',
  },
  addRowButton: {
    height: 20,
    width: 466,
    backgroundColor: '#C9ADA7',
    borderStartColor: '#22223B',
    borderEndColor: '#22223B',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderEndWidth: 1,
    borderStartWidth: 1,
  },
  addButtonText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: 400,
    color: '#22223B',
  },
  addButtonIcon: {
    width: 10,
    height: 10,
    marginLeft: 10,
    resizeMode: 'contain',
  },
  overallTotal: {
    height: 38,
    width: 381,
    alignItems: 'center',
    justifyContent: 'center',
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
  suggestionBg: {
    backgroundColor: 'white', 
    position: 'absolute', 
    top: 196, 
    left: 20, 
    opacity: 0.8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4},
    elevation: 4,
  },
});
