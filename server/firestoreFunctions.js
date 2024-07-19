// server/firestoreFunctions.js

import { collection, deleteDoc, updateDoc, getDocs, query, where, doc, setDoc, getDoc, addDoc, getFirestore } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const firestore = getFirestore();

export const createI_Players = async (players) => {
  if (!Array.isArray(players)) {
    throw new TypeError("The 'players' parameter must be an array");
  }

  // Reference to the I_Players collection inside The_Open_Championship_2024 document of I_Torneos collection
  const collectionRef = collection(firestore, 'I_Torneos', 'The_Open_Championship_2024', 'I_Players');

  for (const player of players) {
    if (player.name && player.rank !== undefined) {
      // Use player's name as the document ID
      const docRef = doc(collectionRef, player.name);
      await setDoc(docRef, {
        rank: player.rank,
        id_player: docRef.id, // Use the auto-generated ID
      });
    } else {
      console.error('Invalid player object', player);
    }
  }
};

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
    const querySnapshot = await getDocs(collection(firestore, 'I_Torneos', 
                                                  'The_Open_Championship_2024', 'I_Players'));
    const playersData = querySnapshot.docs.map(doc => {
      const data = doc.data();  // Get the data without adding the Firestore id
      return { id_player: doc.id, ...data };  // Use id_player as the primary identifier
    });
    console.log("returning playersData", playersData);
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
        id_player: playerId,
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

export const getUserById = async (uid) => {
  try {
    const userDoc = await getDoc(doc(firestore, 'I_Members', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log('No such user!');
      return null;
    }
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const getPlayerName = async (id_player) => {
  try {
    const playerQuery = query(collection(firestore, 'I_Players'), where('id_player', '==', id_player));
    const playerQuerySnapshot = await getDocs(playerQuery);
    if (!playerQuerySnapshot.empty) {
      const playerDoc = playerQuerySnapshot.docs[0];
      //console.log(playerDoc.data());
      return playerDoc.data().name;
    } else {
      console.log('No such player!');
      return null;
    }
  } catch (error) {
    console.error('Error getting player:', error);
    return null;
  }
};


export const fetchQuarterQualifiers = async (tournamentName) => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'I_Torneos', tournamentName, 'I_Cuartos'));
    const sortedPlayerData = querySnapshot.docs
      .map(doc => ({
        id_player: doc.data().id_player,
        name: doc.data().name,
        orden: doc.data().orden
      }))
      .sort((a, b) => a.orden - b.orden);

    return sortedPlayerData.filter(({ name }) => name !== null);
  } catch (error) {
    console.error('Error fetching qualifiers:', error);
    throw error;
  }
};

export const fetchSemiQualifiers = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'I_Semifinales'));
    const sortedPlayerData = querySnapshot.docs
      .map(doc => ({
        id_player: doc.data().id_player,
        orden: doc.data().orden
      }))
      .sort((a, b) => a.orden - b.orden);

    const playerDetails = await Promise.all(
      sortedPlayerData.map(async ({ id_player, orden }) => {
        const name = await getPlayerName(id_player);
        return { id_player, name, orden }; 
      })
    );

    return playerDetails.filter(({ name }) => name !== null);
  } catch (error) {
    console.error('Error fetching qualifiers:', error);
    throw error;
  }
};


export const fetchScoreSheet = async (id_player, tournamentName, collectionName) => {

  console.log(id_player, 'id_player');
  console.log(tournamentName, 'tournamentName');
  console.log(collectionName, 'collectionName');


  try {
    const scoreQuery = query(collection(firestore, 'I_Torneos', tournamentName, collectionName), where('id_player', '==', id_player));
    const querySnapshot = await getDocs(scoreQuery);
    let scoreData = {};
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      for (const key in data) {
        if (/^H(1[0-8]|[1-9])$/.test(key)) {
          scoreData[key] = data[key];
        }
      }
    });

    const name = await getPlayerName(id_player);
    return scoreData;
  } catch (error) {
    console.error('Error fetching score sheet:', error);
    throw error;
  }
};


export const fetchTournament = async () => {
  try {
    const q = query(collection(firestore, 'I_Torneos'), where("activo", "==", 1));
    const querySnapshot = await getDocs(q);
    const activeTournamentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return activeTournamentsData;
  } catch (error) {
    console.error('Error fetching active tournament:', error);
    throw error;
  }
};

export const createI_Cuartos = async () => {
  try {
    const collectionRef = collection(firestore, 'I_Torneos', 'The_Open_Championship_2024', 'I_Cuartos');

    for (let i = 1; i <= 8; i++) {
      const cuartoData = {
        H1: 0, H2: 0, H3: 0, H4: 0, H5: 0, H6: 0,
        H7: 0, H8: 0, H9: 0, H10: 0, H11: 0, H12: 0,
        H13: 0, H14: 0, H15: 0, H16: 0, H17: 0, H18: 0,
        id_player: 0,
        orden: 0
      };
      await addDoc(collectionRef, cuartoData);
    }
    console.log('I_Cuartos created successfully.');
  } catch (error) {
    console.error('Error creating I_Cuartos:', error);
  }
};

export const updateI_Players = async () => {
  try {
    const collectionRef = collection(firestore, 'I_Torneos', 'The_Open_Championship_2024', 'I_Players');
    const querySnapshot = await getDocs(collectionRef);

    for (const docSnap of querySnapshot.docs) {
      const playerName = docSnap.id;
      const playerRef = doc(firestore, 'I_Torneos', 'The_Open_Championship_2024', 'I_Players', playerName);
      
      const updatedData = {
        name: playerName,
        id_player: generateAutoId()
      };

      await updateDoc(playerRef, updatedData);
    }
    
    console.log('I_Players updated successfully.');
  } catch (error) {
    console.error('Error updating I_Players:', error);
  }
};

// Function to generate an auto-generated ID
const generateAutoId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const checkIfSemisExist = async (tournamentId) => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'I_Torneos', tournamentId, 'I_Semifinales'));
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking semifinals:', error);
    throw error;
  }
};

