// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth"; // Import the necessary functions for auth persistence
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for persistence

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXzPEQIqJA9mBoamIjsfAyptIjgpMyo1o",
  authDomain: "internetmatchplay.firebaseapp.com",
  projectId: "internetmatchplay",
  storageBucket: "internetmatchplay.appspot.com",
  messagingSenderId: "1030174523087",
  appId: "1:1030174523087:web:00f3a877aabb57628981ba",
  measurementId: "G-B7Q070NLJ3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), // Add persistence using AsyncStorage
});

export { firestore, auth };
