// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8FWxOFd97lnKaziNtfm6LCL1cpfgX9Uk",
  authDomain: "demotodo-2024.firebaseapp.com",
  projectId: "demotodo-2024",
  storageBucket: "demotodo-2024.firebasestorage.app",
  messagingSenderId: "816174407173",
  appId: "1:816174407173:web:734eefc199106e73bac66c",
  measurementId: "G-201ERM7HQC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {persistence: getReactNativePersistence(ReactNativeAsyncStorage)})
const analytics = getAnalytics(app);

export const db = getFirestore(app);