// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { Platform } from "react-native";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAXzPEQIqJA9mBoamIjsfAyptIjgpMyo1o",
  authDomain: "internetmatchplay.firebaseapp.com",
  projectId: "internetmatchplay",
  storageBucket: "internetmatchplay.appspot.com",
  messagingSenderId: "1030174523087",
  appId: "1:1030174523087:web:00f3a877aabb57628981ba",
  measurementId: "G-B7Q070NLJ3",
};

console.log("Initializing Firebase App with config:", firebaseConfig);
const app = initializeApp(firebaseConfig);
console.log("Firebase App initialized:", app.name);

const firestore = getFirestore(app);

// Initialize Firebase Auth with conditional persistence
let auth;

if (Platform.OS === "web") {
  // For web platforms
  auth = getAuth(app);
} else {
  // For React Native platforms
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;

  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { firestore, auth };
