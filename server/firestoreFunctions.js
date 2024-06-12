// server/firestoreFunctions.js

import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';

const checkIfEmailExists = async (email) => {


  console.log("Inside checkIfEmailExists in firestoreFunctions.js");

  const q = query(collection(firestore, 'I_Members'), where('email', '==', email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

const checkIfUserExists = async (email, password) => {
  console.log("Inside checkIfUserExists in firestoreFunctions.js");
  console.log(`Checking user with email: ${email} and password: ${password}`);

  try {
    const q = query(collection(firestore, 'I_Members'), where('email', '==', email), where('password', '==', password));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      console.log('User found:', userDoc.data());
      return userDoc.data();
    } else {
      console.log('No user found with the provided credentials.');
      return false;
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
};

const addUser = async (user) => {
  const userRef = doc(collection(firestore, 'I_Members'));
  await setDoc(userRef, user);
};

export { checkIfEmailExists, checkIfUserExists, addUser };
