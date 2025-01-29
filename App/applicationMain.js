import React, { useState, useEffect} from 'react';
import { View, Image, TouchableOpacity, StyleSheet, BackHandler} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Dashboard from './screens/BottomScreens/Dashboard';
import ServiceAdd from './screens/BottomScreens/ServiceAdd';
import Earnings from './screens/BottomScreens/Earnings';
import Messages from './screens/BottomScreens/Messages';
import Settings from './screens/BottomScreens/Settings';
import AddCustomer from './screens/AddCustomer';

const ApplicationMain = () => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [addCustomerPage, setAddCustomerPage] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (addCustomerPage) {
        setAddCustomerPage(false); // Go back to ServiceAdd from AddCustomer
        return true; 
      } else if (activePage !== 'ServiceAdd') {
        setActivePage('ServiceAdd'); // Navigate to ServiceAdd if not there
        return true;
      }
      return false; // Allow default behavior (exit app)
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [activePage, addCustomerPage]);

  const renderPage = () => {
    if (addCustomerPage) {
      return <AddCustomer navigateToServiceAdd={() => setAddCustomerPage(false)} />;
    }
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'ServiceAdd':
        return <ServiceAdd navigateToCustomerAdd={() => setAddCustomerPage(true)} />;
      case 'Messages':
        return <Messages />;
      case 'Earnings':
        return <Earnings />;
      case 'Settings':
        return <Settings />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderPage()}</View>
      {!addCustomerPage && (
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
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActivePage('Messages')} style={styles.navButton}>
            <Image
              source={
                activePage === 'Messages'
                  ? require('./assets/BottomNavVector/Messages1.png')
                  : require('./assets/BottomNavVector/Messages.png')
              }
              style={[styles.icon, activePage === 'Messages' && styles.selectedIcon]}
            />
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
    width: 50,
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
});

export default ApplicationMain;
