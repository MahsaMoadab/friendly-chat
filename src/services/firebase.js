// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8wlbmQccmjtruBnGHSyUkxyFCMXN60i8",
  authDomain: "chat-app-35026.firebaseapp.com",
  projectId: "chat-app-35026",
  databaseURL: "http://chat-app-35026.firebaseio.com",
  storageBucket: "chat-app-35026.appspot.com",
  messagingSenderId: "29957188349",
  appId: "1:29957188349:web:c5ce2b2e858c5e71b7ac94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const userDB = getFirestore(app);
const userStorage = getStorage(app) ;

export {auth, userDB, userStorage};