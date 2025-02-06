import React, { useRef, useState, useEffect}from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, FlatList, ScrollView, TextInput, BackHandler} from 'react-native';
import {  ref, onValue, set, update} from 'firebase/database';
import { database } from '../../../firebase';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

export default function Dashboard({ toAdd, toEdit, sendToAdd, sendToEdit}){

  const [customer, setCustomer] = useState({ name: '', mobile: '', date: moment(selectedDate).format('YYYY-MM-DD'), city: '', serviceType: 'Select Service', address: '' });
  const [tasks, setTasks] = useState([]);
  const [tempTaskId, setTempTaskId] = useState(null); 
    useEffect(() => {
      const customerRef = ref(database, 'Tasks');
      if(!toEdit || !toAdd){
        setTempTaskId(null);
      }
      const unsubscribe = onValue(
        customerRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const customerList = Object.keys(data).map((key) => ({
              id: key, 
              ...data[key], 
            }));
            setTasks(customerList); 
          } else {
            setTasks([]);
          }
        },
        {
          onlyOnce: false,
        }
      );
      return () => unsubscribe(); 
    }, []);

    const [isSaved, setIsSaved] = useState(false);
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

    const serviceTypeImage = (machine) => {
      switch(machine){
        case "AC": return require('../../assets/images/Machines/AC.png');
        case "Washing Machine": return require('../../assets/images/Machines/Washing_Machine.png');
        case "Refrigerator": return require('../../assets/images/Machines/Refrigerator.png');
        case "Microwave Oven": return require('../../assets/images/Machines/Microwave.png');
        case "RO Water Purifier": return require('../../assets/images/Machines/RO_Purifier.png');
        case "Water Heater": return require('../../assets/images/Machines/Heater.png');
        case "Induction Stove": return require('../../assets/images/Machines/Induction.png');
        case "Inverter/Battery": return require('../../assets/images/Machines/Inverter.png');
        case "Other": return require('../../assets/images/Machines/Others.png');
      }
    };
    const handleAddTask = (taskId) => {
      setTempTaskId(taskId);
      setCustomer({ name: '', mobile: '', date: moment(selectedDate).format('YYYY-MM-DD'), city: '', serviceType: 'Select Service', address: '' });
      sendToAdd(true);
    };
    const handleEditTask = (taskId) => {
      setTempTaskId(taskId);
      const taskRef = ref(database, `Tasks/${taskId}`);
      onValue(taskRef, (snapshot) => {
        if (snapshot.exists()) {
          setCustomer(snapshot.val()); // Populate input fields with task data
          sendToEdit(true);
        }
      }, { onlyOnce: true });
    };
    const saveTask = () => {
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
      if (!customer.serviceType || customer.serviceType.trim() === 'Select Service') {
        alert('choose a Service type');
        return;
      }  
      if (!customer.address || customer.address.trim() === '') {
        alert('Please Enter Address/Notes');
        return;
      }    
      set(ref(database, `Tasks/${tempTaskId}`), customer)
          .then(() => {
            if(toAdd){
              Alert.alert('Success','Task Added');
              sendToAdd(false);
            }
            else{
              Alert.alert('Success','Task Edited');
              sendToEdit(false);
            }   
          })
          .catch(error => {
            console.log(error);
            Alert.alert('Error',`error code: ${error}`);
          });
      setTempTaskId(null);
    };
    const addToProfile = (taskId) => {
      const customerRef = ref(database, `/Tasks/${taskId}`);
      onValue(customerRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const { isAddedToProfile, ...filteredData } = data;
          filteredData.isAddedToProfile = true;
          filteredData.date = moment().format('YYYY-MM-DD');
          set(ref(database, `/ServiceList/${taskId}`), filteredData)
            .then(() => console.log("Success Task Added"))
            .catch((error) => console.error("Error: ", error.message));
        }
      }, { onlyOnce: true });
      const taskRef = ref(database, `Tasks/${taskId}`);
      update(taskRef, { isAddedToProfile: true })
        .then(() => console.log("Status updated successfully"))
        .catch((error) => console.error("Error updating status:", error));
    };

    const deleteTask = async (taskId) => {
      set(ref(database, `Tasks/${taskId}`), null)
          .then(() => console.log('Success'))
          .catch(error => console.log(error));
    };

    return(
  <View style={styles.container}>
    <Text style = {styles.text}>Dashboard</Text>
    <View style={styles.serviceCalculator}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.calculatorHead}>overall</Text>
        <Text style={styles.calculatorData}>100</Text>
      </View>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.calculatorHead}>completed</Text>
        <Text style={styles.calculatorData}>100</Text>
      </View>
    </View>
    <View style={styles.plainContainer}>
      <Text style={styles.plainText}>Pending Tasks</Text>
      <Image source={require('../../assets/vectors/arrow_right.png')} style={styles.plainIcon}/>
    </View>
    <View style={{width: '100%', height: '438', marginTop: 19}}>
      <FlatList
        data={tasks}
        horizontal
        style={{ marginTop: 10 }}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={<View style={{width:17}} />}
        ListFooterComponent={<View style={{width:7}} />}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <View style={styles.cardView}>
              <Image source={serviceTypeImage(item.serviceType)} style={styles.serviceTypeImage}/>
              <View style={styles.listView}>
                <ScrollView style={{height: '100%'}} showsVerticalScrollIndicator={false}>
                  <Text style={styles.date}>{moment(item.date).format('DD-ddd').toUpperCase()}</Text>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.mobile}>{item.mobile}</Text>
                  <Text style={styles.serviceType}>{item.serviceType}</Text>
                  <Text style={styles.city}>{item.city}</Text>
                  <Text style={styles.address}>{item.address}</Text>
                  <View style={{height:61}}/>
                </ScrollView>
                <TouchableOpacity style={styles.taskEdit} onPress={() => handleEditTask(item.id)}>
                  <Image source={require('../../assets/vectors/taskEdit.png')} style={{height: 35, width: 35, resizeMode: 'contain'}}/>
                </TouchableOpacity>
              </View>
              <LinearGradient
                colors={['#F8FAFFCF', '#F9FBFF']}
                style={styles.cardButtonView}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}>
                <TouchableOpacity style={styles.closeButton} onPress={() => deleteTask(item.id)}>
                  <Text style={styles.buttonText1}>Close</Text>
                </TouchableOpacity>
                { !item.isAddedToProfile ? (
                  <TouchableOpacity style={styles.addToTaskButton} onPress={() => addToProfile(item.id)}>
                  <Text style={styles.buttonText1}>Add to profile</Text>
                </TouchableOpacity>
                ) : (
                  <LinearGradient
                  colors={['#5D5DA1', '#22223B']}
                  style={[styles.addToTaskButton,{flexDirection: 'row'}]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                    <Image source={require('../../assets/vectors/tickWhite.png')} style={{width: 20, height: 20, resizeMode: 'contain', alignSelf: 'center'}}/>
                    <Text style={styles.buttonText2}>Added</Text>
                  </LinearGradient>
                )
                }
              </LinearGradient>
            </View>
          );
        }} 
      />
    </View>
      <View style={{width: '100%', height: '43', marginTop: 14.5,marginBottom: 85, paddingHorizontal: 17,flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Text style={styles.addTaskText}>Add new tasks to your dashboard</Text>
        <TouchableOpacity style={styles.addTaskButton} onPress={() => handleAddTask(moment().format('YYYYMMDDHHmmss'))}>
          <LinearGradient
            colors={['#22223B', '#5D5DA1']}
            style={styles.addTaskButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <Text style={styles.addTaskButtonText}>Add Tasks</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {
        (toEdit || toAdd) && (
        <View style={styles.blurView} >
          <View style={styles.addTaskContainer}>
              <TextInput style={styles.input} placeholder='Name' placeholderTextColor={'#4A4E69'} value={customer.name} onChangeText={(text) => setCustomer({ ...customer, name: text })}/>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TextInput style={[styles.input, {width: 222, height: 43}]} keyboardType="numeric" placeholder='Mobile No.' placeholderTextColor={'#4A4E69'} value={customer.mobile} onChangeText={(text) => setCustomer({ ...customer, mobile: text })}/>
                <TouchableOpacity onPress={() => setOpen(true)} style={[styles.input,{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 47}]}>
                  <Image source={require('../../assets/vectors/calender.png')} style={{width: 25, height: 25, resizeMode: 'contain'}}/>
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
                </TouchableOpacity>
              </View>
              <TextInput style={styles.input} placeholder='City' placeholderTextColor={'#4A4E69'} value={customer.city} onChangeText={(text) => setCustomer({ ...customer, city: text })}/>
              <View style={styles.input}>
                <Picker
                  selectedValue={customer.serviceType || 'Service type'}
                  style={styles.picker}
                  onValueChange={(itemValue) => setCustomer({ ...customer, serviceType: itemValue })}
                  dropdownIconColor={'#EBEEFF'}
                >
                  <Picker.Item label="A.C" value="AC" />
                  <Picker.Item label="Washing Machine" value="Washing Machine" />
                  <Picker.Item label="Refrigerator" value="Refrigerator" />
                  <Picker.Item label="Microwave Oven" value="Microwave Oven" />
                  <Picker.Item label="RO Water Purifier" value="RO Water Purifier" />
                  <Picker.Item label="Water Heater" value="Water Heater" />
                  <Picker.Item label="Induction Stove" value="Induction Stove" />
                  <Picker.Item label="Inverter/Battery" value="Inverter/Battery" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
                <TouchableOpacity style={styles.pickerCustomIcon}>
                  <Text style={{paddingLeft: 9, color: '#4A4E69'}}>{customer.serviceType}</Text>
                  <Image source={require('../../assets/vectors/pickerDownArrow.png')} style={{width: 15, height: 15, resizeMode: 'cover'}}/>
                </TouchableOpacity>
              </View>
              <TextInput style={[styles.input, { height: 105, textAlignVertical: 'top' }]} placeholderTextColor={'#4A4E69'} multiline={true} scrollEnabled={true} numberOfLines={4} placeholder='Address' value={customer.address} onChangeText={(text) => setCustomer({ ...customer, address: text })}/>
              <TouchableOpacity style={styles.addEditTaskButton} onPress={saveTask}>
                <LinearGradient
                  colors={['#22223B', '#5D5DA1']}
                  style={styles.addEditTaskButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0}}>
                  <Text style={styles.addEditTaskText}>{toEdit ? 'Edit Task' : 'Add Task'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )
      }
    </View>
  )};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EBEEFF',
  },
  text: {
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: 400,
    color: '#4A4E69',
    marginTop: 37
  },
  serviceCalculator: {
    flexDirection: 'row',
    width: 246,
    justifyContent: 'space-between',
    marginTop: 13,
  },
  calculatorHead: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 16,
    color: '#9A8C98',
  },
  calculatorData: {
    fontFamily: 'Quantico-Bold',
    fontSize: 24,
    color: '#4A4E69',
    textShadowColor: '#00000040',
    textShadowOffset: { width: 0, height: 4 }, 
    textShadowRadius: 4,
  },
  plainContainer: {
    paddingHorizontal: 17,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 13,
    justifyContent: 'space-between'
  },
  plainText: {
    fontFamily: 'Poppins',
    fontSize: 20,
    color: '#4A4E69',
    fontWeight: 400,
  },
  plainIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },



  cardView: {
    width: 249,
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    marginRight: 10,
  },
  serviceTypeImage: {
    width: '100%',
    height: 143,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    resizeMode: 'cover',
  },
  listView: {
    paddingHorizontal: 10,
    paddingTop: 10,
    flex: 1,
  },
  date: {
    fontFamily: 'Quantico-Bold',
    fontSize: 20,
    color: '#9A8C98'
  },
  name: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 20,
    color: '#22223B',
    marginTop: 15,
  },
  mobile: {
    fontFamily: 'Quantico',
    fontSize: 16,
    fontWeight: 400,
    color: '#22223B',
    marginTop: 15,
  },
  serviceType: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: 400,
    color: '#22223B',
    marginTop: 15,
  },
  city: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: 400,
    color: '#22223B',
    marginTop: 15,
  },
  address: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: 400,
    color: '#22223B',
    marginTop: 15,
  },
  cardButtonView: {
    width: '100%',
    height: 61,
    color: '',
    position: 'absolute',
    padding: 10,
    bottom: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  closeButton: {
    height: '100%',
    width: 79,
    borderColor: '#1C1E1E80',
    backgroundColor: '#F9FBFF',
    borderRadius: 30,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 0.5,
  },
  addToTaskButton: {
    height: '100%',
    width: 129,
    backgroundColor: '#F9FBFF',
    borderColor: '#1C1E1E80',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText1: {
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 16,
    color: '#22223B',
  },
  buttonText2: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    marginLeft: 10,
    marginTop: 3,
    alignSelf: 'center',
    fontSize: 16,
    color: '#FFFFFF',
  },
  taskEdit: {
    position: 'absolute',
    top: 10,
    right: 10,
  },





  addTaskText: {
    width: 166,
    height: 48,
    fontFamily: 'Poppins',
    fontWeight: 300,
    fontSize: 16,
    color: '#111C3D',
    textAlign: 'left'
  },
  addTaskButton: {
    width: 126,
    height: 43,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  addTaskButtonText: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 16,
    color: '#FFFFFF',
  },
  blurView: {
    borderRadius: 5,
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#00000099',
  },
  addTaskContainer: {
    width: 317,
    height: 500,
    marginTop: 63,
    paddingLeft: 16, 
    paddingRight: 16,
    justifyContent: 'center',
    backgroundColor: '#EBEEFF',
    borderRadius: 5,
  },
  input: {
    width: '100%',
    height: 43,
    borderColor: '#22223B',
    color: '#4A4E69',
    fontFamily: 'Poppins',
    paddingHorizontal: 16,
    fontWeight: 400,
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 19,
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
  addEditTaskButton: {
    width: 126,
    height: 43,
    borderRadius: 30,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  addEditTaskText: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 16,
    color: '#FFFFFF',
    width: '100%',
    textAlign: 'center',
  },
});
