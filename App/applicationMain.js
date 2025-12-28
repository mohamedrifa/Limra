import React, { useState, useEffect} from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, BackHandler} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Dashboard from './screens/BottomScreens/Dashboard';
import ServiceAdd from './screens/BottomScreens/Services';
import Earnings from './screens/BottomScreens/Earnings';
import Messages from './screens/Messages';
import Settings from './screens/BottomScreens/Settings';

const ApplicationMain = () => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [addCustomerPage, setAddCustomerPage] = useState(false);
  const [toEdit, setToEdit] = useState(false);
  const [toAdd, setToAdd] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [terms, setTerms] = useState(false);
  const [messagesPage, setMessagesPage] = useState(false);
  const [customerHisPage, setCustomerHisPage] = useState(false);
  

  useEffect(() => {
    const backAction = () => {
      if (toAdd || toEdit || changePass || terms) {
        setToAdd(false);
        setToEdit(false);
        setChangePass(false);
        setTerms(false);
        return true;
      } else if (addCustomerPage) {
        setAddCustomerPage(false);
        return true;
      } else if (customerHisPage) {
        setCustomerHisPage(false);
        return true;
      } else if (messagesPage) {
        setMessagesPage(false);
        return true;
      } else if (activePage !== 'Dashboard') {
        setActivePage('Dashboard');
        return true;
      } 
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [activePage, addCustomerPage, messagesPage, toAdd, toEdit, customerHisPage]);

  useEffect(() => {
    if (activePage !== 'Dashboard') {
        setToAdd(false);
        setToEdit(false);
    }
    if(activePage !== 'Settings') {
      setChangePass(false);
      setTerms(false);
    }
  }, [activePage]);


  const renderPage = () => {
  if (messagesPage) {
    return <Messages navigateToServiceAdd={() => setMessagesPage(false)}/>;
  }
  switch (activePage) {
    case 'Dashboard':
      return <Dashboard toAdd={toAdd} toEdit={toEdit} sendToAdd={setToAdd} sendToEdit={setToEdit}/>;
    case 'ServiceAdd':
      return <ServiceAdd 
                navigateToCustomerAdd={setAddCustomerPage} 
                AddCustomer={addCustomerPage}

                navigateToMessages={() => setMessagesPage(true)} 
                
                navigateToHistory={setCustomerHisPage}
                history={customerHisPage}
                />;
    case 'Earnings':
      return <Earnings/>;
    case 'Settings':
      return <Settings changePass={changePass} terms={terms} sendToChange={setChangePass} sendTerms={setTerms}/>;
    default:
      return null;
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderPage()}</View>
      {!(addCustomerPage || messagesPage || customerHisPage) && (
        <LinearGradient colors={['#F9FBFFCF', '#F9FBFF']} style={styles.navContainer}>
          <TouchableOpacity onPress={() => setActivePage('Dashboard')} style={styles.navButton}>
            <Image
              source={
                activePage === 'Dashboard'
                  ? require('./assets/BottomNavVector/Dashboard1.png')
                  : require('./assets/BottomNavVector/Dashboard.png')
              }
              style={[styles.icon, activePage === 'Dashboard' && styles.selectedIcon]}
            />
            <Text style={[styles.bottomText, activePage === 'Dashboard' && {color: '#22223B'}]}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActivePage('ServiceAdd')} style={styles.navButton}>
            <Image
              source={
                activePage === 'ServiceAdd'
                  ? require('./assets/BottomNavVector/ServiceAdd1.png')
                  : require('./assets/BottomNavVector/ServiceAdd.png')
              }
              style={[styles.icon, activePage === 'ServiceAdd' && styles.selectedIcon]}
            />
            <Text style={[styles.bottomText, activePage === 'ServiceAdd' && {color: '#22223B'}]}>Profiles</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActivePage('Earnings')} style={styles.navButton}>
            <Image
              source={
                activePage === 'Earnings'
                  ? require('./assets/BottomNavVector/Earnings1.png')
                  : require('./assets/BottomNavVector/Earnings.png')
              }
              style={[styles.icon, activePage === 'Earnings' && styles.selectedIcon]}
            />
            <Text style={[styles.bottomText, activePage === 'Earnings' && {color: '#22223B'}]}>Earnings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActivePage('Settings')} style={styles.navButton}>
            <Image
              source={
                activePage === 'Settings'
                  ? require('./assets/BottomNavVector/Settings1.png')
                  : require('./assets/BottomNavVector/Settings.png')
              }
              style={[styles.icon, activePage === 'Settings' && styles.selectedIcon]}
            />
            <Text style={[styles.bottomText, activePage === 'Settings' && {color: '#22223B'}]}>Settings</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    height: 50,
    justifyContent: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  selectedIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  bottomText: {
    fontSize: 10,
    color: '#4A4E69',
    fontWeight: 400,
    fontFamily: 'Open Sans Light',
    textAlign: 'center',
  },
});

export default ApplicationMain;
