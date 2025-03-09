// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyD3SY9AjbBnXjlyjL51vwCosQ-1NqWJ--M",

  authDomain: "limra-7ba51.firebaseapp.com",

  databaseURL: "https://limra-7ba51-default-rtdb.firebaseio.com",

  projectId: "limra-7ba51",

  storageBucket: "limra-7ba51.firebasestorage.app",

  messagingSenderId: "422137489540",

  appId: "1:422137489540:web:66eff63a7b89cba357fad1",

  measurementId: "G-FZJN29Q5PK"

};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export database for use in your app
const database = getDatabase(app);
export { database };
