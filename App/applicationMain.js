import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './screens/BottomScreens/Dashboard';
import ServiceAdd from './screens/BottomScreens/ServiceAdd';
import Bill from './screens/BottomScreens/Bill';
import Messages from './screens/BottomScreens/Messages';
import Settings from './screens/BottomScreens/Settings';

const Tab = createBottomTabNavigator();

export default function applicationMain() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let icon;

          if (route.name === 'Dashboard') {
            icon = focused
              ? require('./assets/BottomNavVector/Dashboard1.png') // Active icon
              : require('./assets/BottomNavVector/Dashboard.png'); // Inactive icon
          } else if (route.name === 'ServiceAdd') {
            icon = focused
              ? require('./assets/BottomNavVector/ServiceAdd1.png')
              : require('./assets/BottomNavVector/ServiceAdd.png');
          } else if (route.name === 'Messages') {
            icon = focused
              ? require('./assets/BottomNavVector/Messages1.png')
              : require('./assets/BottomNavVector/Messages.png');
          } else if (route.name === 'Bill') {
            icon = focused
              ? require('./assets/BottomNavVector/Bill1.png')
              : require('./assets/BottomNavVector/Bill.png');
          } else if (route.name === 'Settings') {
            icon = focused
              ? require('./assets/BottomNavVector/Settings1.png')
              : require('./assets/BottomNavVector/Settings.png');
          }

          return (
            <Image
              source={icon}
              style={{resizeMode: 'contain',
              width: focused ? 35 : 30, 
              height: focused ? 35 : 30,
              }}
            />
          );
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 67,
        },
        tabBarIconStyle: {
          height: 55,
        }
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="ServiceAdd" component={ServiceAdd} />
      <Tab.Screen name="Messages" component={Messages} />
      <Tab.Screen name="Bill" component={Bill} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}
