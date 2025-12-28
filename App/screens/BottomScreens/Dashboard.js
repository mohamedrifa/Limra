import React, { useRef, useState, useEffect}from 'react';
import { View, Text, StyleSheet, Image, Alert, Animated, TouchableOpacity, FlatList, ScrollView, TextInput } from 'react-native';
import AddEditTaskModal from '../../component/dashboard/AddEditTaskModal';
import TaskCard from '../../component/dashboard/TaskCard';
import DeleteConfirmModal from '../../component/dashboard/DeleteConfirmModal';
import moment from 'moment';
import { Services } from '../../constants/varConst';
import LinearGradient from 'react-native-linear-gradient';
import { fetchTasks, fetchTaskById, saveTaskToDB, updateCompletedTasks, deleteTaskAtDB, MobileNumbersSuggest, fetchCustomerByMobile, addTaskToProfile } from '../../utils/api';

export default function Dashboard({ toAdd, toEdit, sendToAdd, sendToEdit}){

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [customer, setCustomer] = useState({ name: '', mobile: '', date: moment(selectedDate).format('YYYY-MM-DD'), city: '', serviceType: 'Select type', address: '' });
  const [tasks, setTasks] = useState([]);
  const [tempTaskId, setTempTaskId] = useState(null); 
  const [overallTasks, setOverallTasks] = useState();
  const [completedTasks, setCompletedTasks] = useState();
  const [refresh, setRefresh] = useState(true);
  const [animations, setAnimations] = useState([]);
  const [toClose, setToClose] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const options = Services;

  const flatListRef = useRef(null);

  useEffect(() => {
    const unsubscribe = fetchTasks(
      ({ customerList, overallTasks, completedTasks }) => {
        setTasks(customerList);
        setOverallTasks(overallTasks);
        setCompletedTasks(completedTasks);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAddTask = (taskId) => {
    setTempTaskId(taskId);
    setCustomer({ name: '', mobile: '', date: moment(selectedDate).format('YYYY-MM-DD'), city: '', serviceType: 'Select Service', address: '' });
    sendToAdd(true);
  };

  const handleEditTask = async (taskId) => {
    setTempTaskId(taskId);
    const task = await fetchTaskById(taskId);
    if (task) {
      setCustomer(task);
      sendToEdit(true);
    }
  };

  const saveTask = async () => {
    setShowSuggestion(false)
    if (customer.name.trim() === '' && customer.mobile.trim() === '' && customer.city.trim() === '' &&customer.address.trim() === '') {
      Alert.alert("Note",'Please Enter All the Credentials');
      return;
    };
    if (!customer.name || customer.name.trim() === '') {
      Alert.alert("Note",'Please Enter Name');
      return;
    };
    if (!customer.mobile || customer.mobile.trim() === '') {
      Alert.alert("Note",'Please Enter Mobile No');
      return;
    }
    if (!customer.city || customer.city.trim() === '') {
      Alert.alert("Note",'Please Enter City');
      return;
    }
    if (!customer.serviceType || customer.serviceType.trim() === 'Select type') {
      Alert.alert("Note",'choose a Service type');
      return;
    }  
    if (!customer.address || customer.address.trim() === '') {
      Alert.alert("Note",'Please Enter Address/Notes');
      return;
    }    
    const result = await saveTaskToDB({
      taskId: tempTaskId,
      customer,
      toAdd,
      overallTasks,
    });

    if (!result.success) {
      Alert.alert("Error", `error code: ${result.error}`);
      return;
    }

    if (result.type === "add") {
      Alert.alert("Success", "Task Added");
      sendToAdd(false);
    } else {
      Alert.alert("Success", "Task Edited");
      sendToEdit(false);
    }
    setTempTaskId(null);
  };

  const topUpdate = async (taskId) => {
    const result = await updateCompletedTasks({
      taskId,
      completedTasks,
    });
    if (result?.success) {
      console.log("Completed tasks updated");
    }
  };

  const deleteTask = async (taskId) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    const tasksObject = updatedTasks.reduce((acc, task) => {
      const { id, ...rest } = task;
      acc[id] = rest;
      return acc;
    }, {});
    deleteTaskAtDB(tasksObject, overallTasks, completedTasks);
  };

  useEffect(() => {
    const newAnimations = tasks.map(() => new Animated.Value(0));
    setAnimations(newAnimations);
    console.log("Animations initialized:", newAnimations);
  }, [tasks]);
    const [tempIndex, setTempIndex] = useState();
    const moveItem = () => {
      if (!animations[tempIndex]) return;
      setToClose(false);
      Animated.timing(animations[tempIndex], {
        toValue: 500, 
        duration: 500,
        useNativeDriver: true,
      }).start(() => {      
        const updatedTasks = tasks.filter(task => task.id !== tempTaskId);
        setTasks(updatedTasks);
        topUpdate(tempTaskId);
        deleteTask(tempTaskId);
        setTempIndex(null);
        setTempTaskId(null);
      }
    );
  };

  const delConfirmation = (index, taskId) => {
    setToClose(true);
    setTempIndex(index);
    setTempTaskId(taskId);
  };

  useEffect(() => {
    const unsubscribe = MobileNumbersSuggest(setSuggestions);
    return () => unsubscribe();
  }, []);

  const filtered = suggestions.filter(item =>
    item
      ?.toString()
      .toLowerCase()
      .includes((customer.mobile ?? '').toString().toLowerCase())
  );

  const selectedSuggestion = async (mobileNo) => {
    const customerData = await fetchCustomerByMobile(mobileNo, tempTaskId);
    if (customerData) {
      setCustomer(customerData);
      setShowSuggestion(false);
    }
  };

  const onAddToProfile = async (item) => {
    const res = await addTaskToProfile(item);
    if(res.success){
      console.log("added to profile");
    }
    else{
      console.log("an error occured"+res.error);
    }
  }

  return(
    <View style={styles.container}>
      <Text style = {styles.text}>Dashboard</Text>
      <View style={styles.serviceCalculator}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.calculatorHead}>overall</Text>
          <Text style={styles.calculatorData}>{overallTasks}</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.calculatorHead}>completed</Text>
          <Text style={styles.calculatorData}>{completedTasks}</Text>
        </View>
      </View>
      <View style={styles.plainContainer}>
        <Text style={styles.plainText}>Pending Tasks</Text>
        <Image source={require('../../assets/vectors/arrow_right.png')} style={styles.plainIcon}/>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
        <View style={{flex: 1, marginTop: 18.5, width: '100%', alignItems: 'flex-start'}}>
          { refresh && 
            <FlatList
              ref={flatListRef}
              data={[...tasks]}
              horizontal
              style={{ height: 450 }}
              showsHorizontalScrollIndicator={false}
              ListHeaderComponent={<View style={{width:17}} />}
              ListFooterComponent={<View style={{width:7}} />}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <TaskCard
                  item={item}
                  index={index}
                  animation={animations[index]}
                  onEdit={() => handleEditTask(item.id)}
                  onClose={delConfirmation}
                  onAddToProfile={() => onAddToProfile(item)}
                />
              )}
            />  
          }
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
      </ScrollView>
      <AddEditTaskModal
        toEdit={toEdit}
        toAdd={toAdd}
        customer={customer}
        setCustomer={setCustomer}
        options={options}
        saveTask={saveTask}
        open={open}
        setOpen={setOpen}
        date={date}
        setDate={setDate}
        showSuggestion={showSuggestion}
        setShowSuggestion={setShowSuggestion}
        filtered={filtered}
        selectedSuggestion={selectedSuggestion}
      />
      <DeleteConfirmModal
        visible={toClose}
        onCancel={() => setToClose(false)}
        onConfirm={() => moveItem(tempIndex)}
      />
    </View>
  );
}

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
  serviceTypeImage: {
    width: '100%',
    height: 143,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    resizeMode: 'cover',
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
});
