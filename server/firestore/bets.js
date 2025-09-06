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

import { fetchQualifiersIds } from "./tournaments";

import { firestore } from "../config/firebaseConfig";


const fetchApuestasIds = async (tournamentId, userId) => {
  const currentYear = new Date().getFullYear().toString();
  try {
    const querySnapshot = doc(firestore, "I_Torneos", currentYear, "Tournaments", tournamentId, "I_Apuestas", userId);
    const q = await getDoc(querySnapshot);
    let ids = [];
    if (q.exists()) {
      const data = q.data();
      for (const key in data) {
        ids.push(data[key]);
      }
    }
    return ids;

  } catch (error) {
    console.error("Error fetching bets:", error);
    return;
  }
}

export const hasUserClassified = async (tournamentId, userId) => {
  const currentYear = new Date().getFullYear().toString();
  try {
    const tournamentRef = doc(firestore, "I_Torneos", currentYear, "Tournaments", tournamentId);
    const tournamentRefDoc = await getDoc(tournamentRef);

    if (!tournamentRefDoc.exists()) {
      console.log("Tournament not found.");
      return null;
    }

    const apuestasRef = doc(tournamentRef, "I_Apuestas", userId);
    const apuestasDoc = await getDoc(apuestasRef);
1
    if (!apuestasDoc.exists()) {
      console.log("User has not placed a bet.");
      return false;
    }
    const minimoClasificacion = tournamentRefDoc.data().minimoClasificacion || 0;
    
    if (minimoClasificacion === 0) {
      console.log("No minimum classification set.");
      return null;
    }

    const ids = await fetchQualifiersIds(tournamentId, "I_Cuartos");
    const apuestasIds = await fetchApuestasIds(tournamentId, userId);
    let result = [];

    apuestasIds.forEach((id) => {
      if (ids.includes(id)) {
        result.push(id);
      }
    });

    return [result.length >= minimoClasificacion, result];

  } catch (error) {
    console.error("Error checking user classification:", error);
    return [false, []];
  }
};

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

    const apuestasCollectionRef = collection(
      firestore,
      "I_Torneos",
      currentYear,
      "Tournaments",
      tournamentId,
      "I_Apuestas",
    );

    // Verificar si la subcolección tiene documentos
    const apuestasSnapshot = await getDocs(apuestasCollectionRef);

    if (apuestasSnapshot.empty) {
      
      return false;
    }

    // Referencia al documento de la apuesta específica del usuario
    const apuestaDocRef = doc(apuestasCollectionRef, userId);

    // Verificar si el documento del usuario existe
    const apuestaDocSnap = await getDoc(apuestaDocRef);

    return apuestaDocSnap.exists();
  } catch (error) {
    console.error("Error checking if user made bet:", error);
    throw error;
  }
};

export const deleteBet = async (tournamentId, playerIds, userId) => {
  const db = firestore;
  const currentYear = new Date().getFullYear().toString();

  try {
    const updatePromises = playerIds.map(async (playerId) => {
      const playerDocRef = doc(
        db,
        "I_Torneos",
        currentYear,
        "Tournaments",
        tournamentId,
        "I_Players",
        playerId
      );

      const playerDocSnap = await getDoc(playerDocRef);

      if (playerDocSnap.exists()) {
        const currentData = playerDocSnap.data();
        const currentApuestas = currentData.apuestas || 0;
        const updatedApuestas = Math.max(0, currentApuestas - 1);

        return updateDoc(playerDocRef, {
          apuestas: updatedApuestas,
        });
      } else {
        console.log(`Player ${playerId} not found in I_Players collection.`);
      }
    });

    await Promise.all(updatePromises);

    const apuestaDocRef = doc(
      db,
      "I_Torneos",
      currentYear,
      "Tournaments",
      tournamentId,
      "I_Apuestas",
      userId
    );
    await deleteDoc(apuestaDocRef);

    console.log(`Deleted bet document for user ${userId}`);
  } catch (error) {
    console.error("Error deleting Bet:", error);
    throw error;
  }
};
