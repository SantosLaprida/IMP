import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { Platform } from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";



const extra = Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {};


const firebaseConfig = {
  apiKey: extra.firebaseApiKey,
  authDomain: extra.firebaseAuthDomain,
  projectId: extra.firebaseProjectId,
  storageBucket: extra.firebaseStorageBucket,
  messagingSenderId: extra.firebaseMessagingSenderId,
  appId: extra.firebaseAppId,
  measurementId: extra.firebaseMeasurementId,
};

// Declare variables we'll export
let app;
let firestore;
let auth;


try {
  app = initializeApp(firebaseConfig);
  firestore = getFirestore(app);
  
  if (Platform.OS === "web") {
    auth = getAuth(app);
  } else {
    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

    } catch (error) {

      // Fallback to standard auth if the above fails
      auth = getAuth(app);

    }
  }

  console.log("===== FIREBASE CONFIG INITIALIZATION COMPLETE =====");
} catch (error) {
  console.error("===== FIREBASE INITIALIZATION FAILED =====");
  console.error("Error details:", error.message);
  console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
  
  // Re-throw the error to ensure it's not silently ignored
  throw error;
}

// Export the initialized services
export { app, firestore, auth };