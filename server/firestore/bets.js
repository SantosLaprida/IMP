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

import { firestore } from "../config/firebaseConfig";

export const userMadeBet = async (tournamentId, userId) => {
  const currentYear = new Date().getFullYear().toString();
  try {
    if (
      !tournamentId ||
      typeof tournamentId !== "string" ||
      !userId ||
      typeof userId !== "string"
    ) {
      throw new Error("Invalid tournament ID or user ID.");
    }

    // Reference to the specific bet document in the I_Apuestas sub-collection
    const apuestaDocRef = doc(
      firestore,
      "I_Torneos",
      currentYear,
      tournamentId,
      "I_Apuestas",
      userId
    );

    // Check if the bet document exists
    const apuestaDocSnap = await getDoc(apuestaDocRef);

    // If the document exists, return true; otherwise, return false
    return apuestaDocSnap.exists();
  } catch (error) {
    console.error("Error checking if user made bet:", error);
    throw error;
  }
};

export const deleteBet = async (tournamentId, playerNames, userId) => {
  try {
    const db = firestore;

    for (const playerName of playerNames) {
      const playerDocRef = doc(
        db,
        "I_Torneos",
        tournamentId,
        "I_Players",
        playerName
      );

      const playerDocSnap = await getDoc(playerDocRef);

      if (playerDocSnap.exists()) {
        const currentData = playerDocSnap.data();
        const currentApuestas = currentData.apuestas || 0;

        // Decrement apuestas by 1, ensuring it doesn't go below 0
        const updatedApuestas = Math.max(0, currentApuestas - 1);

        // Update the apuestas field
        await updateDoc(playerDocRef, {
          apuestas: updatedApuestas,
        });
      } else {
        console.log(`Player ${playerName} not found in I_Players collection.`);
      }
    }

    // Delete the document in the I_Apuestas collection for the specified userId
    const apuestaDocRef = doc(
      db,
      "I_Torneos",
      tournamentId,
      "I_Apuestas",
      userId
    );
    await deleteDoc(apuestaDocRef);
    console.log(
      `Deleted bet document for user ${userId} in I_Apuestas collection`
    );
  } catch (error) {
    console.error("Error deleting Bet:", error);
    throw error;
  }
};
