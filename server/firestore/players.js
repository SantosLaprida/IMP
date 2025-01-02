import {
  collection,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getFirestore,
} from "firebase/firestore";
import { auth, db } from "./config/firebaseConfig";

const firestore = getFirestore();

export const fetchPlayersFromFirestore = async (tournamentId) => {
  try {
    const querySnapshot = await getDocs(
      collection(firestore, "I_Torneos", tournamentId, "I_Players")
    );
    const playersData = querySnapshot.docs.map((doc) => {
      const data = doc.data(); // Get the data without adding the Firestore id
      return { id_player: doc.id, ...data }; // Use id_player as the primary identifier
    });
    return playersData;
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
};
