// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXzPEQIqJA9mBoamIjsfAyptIjgpMyo1o",
  authDomain: "internetmatchplay.firebaseapp.com",
  projectId: "internetmatchplay",
  storageBucket: "internetmatchplay.appspot.com",
  messagingSenderId: "1030174523087",
  appId: "1:1030174523087:web:00f3a877aabb57628981ba",
  measurementId: "G-B7Q070NLJ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };