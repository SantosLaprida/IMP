// server/firestoreFunctions.js

import { collection, getDocs, query, where, doc, setDoc, getDoc, addDoc } from 'firebase/firestore';
import { firestore, auth } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

export const registerUser = async (email, password, firstName, lastName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User registered:', userCredential.user);

    // Store additional user data in Firestore
    const uid = userCredential.user.uid;
    const userRef = doc(firestore, 'I_Members', uid);
    await setDoc(userRef, {
      email: email,
      firstName: firstName,
      lastName: lastName,
    });

    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error.code, error.message);
    throw error;
  }
};


export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', userCredential.user);

    // Retrieve additional user data from Firestore if needed
    const uid = userCredential.user.uid;
    const userRef = doc(firestore, 'I_Members', uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      console.log('User data:', userDoc.data());
      return { ...userCredential.user, ...userDoc.data() };
    } else {
      console.log('No such user document!');
      return userCredential.user;
    }
  } catch (error) {
    console.error('Error logging in user:', error.code, error.message);
    throw error;
  }
};

export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent!');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const fetchPlayers = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'I_Players'));
    const playersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return playersData;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};


export const storeTeam = async (userId, team) => {
  try {
    const userRef = doc(firestore, 'Teams', userId);
    await setDoc(userRef, { team });
    console.log('Team stored successfully');
  } catch (error) {
    console.error('Error storing team:', error);
    throw error;
  }
};

export const fetchPlayersFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'I_Players'));
    const playersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return playersData;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};


export const storeTeamInFirestore = async (userId, team) => {
  try {
    const teamCollection = collection(firestore, 'I_Apuestas');

    for (const playerId of team) {
      await addDoc(teamCollection, {
        id_member: userId,
        id_player: playerId
      });
    }

    console.log('Team stored successfully');
  } catch (error) {
    console.error('Error storing team:', error);
    throw error;
  }
};



export const fetchTeamFromFirestore = async (userId) => {
  try {
    const teamQuery = query(collection(firestore, 'I_Apuestas'), where('id_member', '==', userId));
    const querySnapshot = await getDocs(teamQuery);
    const teamData = querySnapshot.docs.map(doc => doc.data());
    return teamData;
  } catch (error) {
    console.error('Error fetching team:', error);
    throw error;
  }
};






// const checkIfEmailExists = async (email) => {


//   console.log("Inside checkIfEmailExists in firestoreFunctions.js");

//   const q = query(collection(firestore, 'I_Members'), where('email', '==', email));
//   const querySnapshot = await getDocs(q);
//   return !querySnapshot.empty;
// };

// const checkIfUserExists = async (email, password) => {
  
//   console.log("Inside checkIfUserExists in firestoreFunctions.js");
//   console.log(`Checking user with email: ${email} and password: ${password}`);

//   try {
//     const q = query(collection(firestore, 'I_Members'), where('email', '==', email), where('password', '==', password));
//     const querySnapshot = await getDocs(q);

//     if (!querySnapshot.empty) {
//       const userDoc = querySnapshot.docs[0];
//       console.log('User found:', userDoc.data());
//       return userDoc.data();
//     } else {
//       console.log('No user found with the provided credentials.');
//       return false;
//     }
//   } catch (error) {
//     console.error('Error checking user existence:', error);
//     return false;
//   }
// };

// const addUser = async (user) => {
//   const userRef = doc(collection(firestore, 'I_Members'));
//   await setDoc(userRef, user);
// };

// export { checkIfEmailExists, checkIfUserExists, addUser };
