import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import LoginPages from './loginPages'; 
import ApplicationMain from './applicationMain'; 
import Immersive from 'react-native-immersive';

const Stack = createStackNavigator();

const firebaseConfig = {
    apiKey: "AIzaSyChgI_NH_sQuKKx9hUSNPRd1FbLHf2FiIw",
    authDomain: "limra-7ba51.firebaseapp.com",
    projectId: "limra-7ba51",
    storageBucket: "limra-7ba51.appspot.com",
    messagingSenderId: "422137489540",
    appId: "1:422137489540:android:b054531093eae4c957fad1",
};

const BridgeNavigator = () => {
    const [initialRoute, setInitialRoute] = useState('LoginPages'); // Default to LoginPages
    const [initializing, setInitializing] = useState(true);
    useEffect(() => {
        Immersive.on();
        return () => {
          Immersive.off();
        };
      }, []);

    useEffect(() => {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        const unsubscribe = auth().onAuthStateChanged((user) => {
            if (user) {
                setInitialRoute('ApplicationMain'); 
            } else {
                setInitialRoute('LoginPages'); 
            }
            setInitializing(false);
        });
        return unsubscribe;
    }, []);

    if (initializing) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRoute}>
                <Stack.Screen
                    name="LoginPages"
                    component={LoginPages}
                    options={{ headerShown: false }} 
                />
                <Stack.Screen
                    name="ApplicationMain"
                    component={ApplicationMain}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default BridgeNavigator;