// server/firestoreFunctions.js

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

/**
 *
 * @param {*} tournamentId
 * @returns True or False, if returns null something went wrong with the database
 */

export const getMinimumClassification = async (tournamentId) => {
  
  const currentYear = new Date().getFullYear().toString();
  try {
    const tournamentDocRef = doc(db, "I_Torneos", currentYear, "Tournaments", tournamentId);

    const tournamentDoc = await getDoc(tournamentDocRef);

    if (tournamentDoc.exists()) {
      const data = tournamentDoc.data();
      const minimoClasificacion = data.minimoClasificacion;

      return minimoClasificacion;
    } else {
      console.error("No such document found");
      return null;
    }
  } catch (error) {
    console.error("Error checking bracket:", error);
    throw error;
  }
};
