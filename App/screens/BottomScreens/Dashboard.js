import React, { useState, useEffect}from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView} from 'react-native';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { database } from '../../../firebase';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
    useEffect(() => {
      const customerRef = ref(database, 'Tasks');
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
                <TouchableOpacity style={styles.taskEdit}>
                  <Image source={require('../../assets/vectors/taskEdit.png')} style={{height: 35, width: 35, resizeMode: 'contain'}}/>
                </TouchableOpacity>
              </View>
              <LinearGradient
                colors={['#F8FAFFCF', '#F9FBFF']}
                style={styles.cardButtonView}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}>
                <TouchableOpacity style={styles.closeButton}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addToTaskButton}>
                  <Text style={styles.buttonText}>Add to profile</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          );
        }} />
    </View>
    <View style={{width: '100%', height: '43', marginTop: 14.5,marginBottom: 85, paddingHorizontal: 17,flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
      <Text style={styles.addTaskText}>Add new tasks to your dashboard</Text>
      <TouchableOpacity style={styles.addTaskButton}>
        <LinearGradient
          colors={['#22223B', '#5D5DA1']}
          style={styles.addTaskButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <Text style={styles.addTaskButtonText}>Add Tasks</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
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
    color: '#22223B'
  },
  serviceType: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: 400,
    color: '#22223B'
  },
  city: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: 400,
    color: '#22223B'
  },
  address: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: 400,
    color: '#22223B'
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
  buttonText: {
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 16,
    color: '#22223B',
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
  }
});

export default Dashboard;
