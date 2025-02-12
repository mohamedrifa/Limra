// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUJu5RmXrcsg0ZUzoGhey3tWimzk8D_ls",
  authDomain: "limra-560bd.firebaseapp.com",
  databaseURL: "https://limra-560bd-default-rtdb.firebaseio.com",
  projectId: "limra-560bd",
  storageBucket: "limra-560bd.firebasestorage.app",
  messagingSenderId: "291840741923",
  appId: "1:291840741923:web:793fdb4de36ba81284d796",
  measurementId: "G-H4HDGHE8ND"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export database for use in your app
const database = getDatabase(app);
export { database };
