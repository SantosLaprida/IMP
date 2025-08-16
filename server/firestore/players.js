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
  orderBy,
} from "firebase/firestore";

import { firestore } from "../config/firebaseConfig";

export const fetchPlayersFromFirestore = async (tournamentId) => {
  const currentYear = new Date().getFullYear().toString();
  try {
    const querySnapshot = await getDocs(
      collection(
        firestore,
        "I_Torneos",
        currentYear,
        "Tournaments",
        tournamentId,
        "I_Players"
      )
    );
    const playersData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { idPlayer: doc.id, ...data };
    });
    return playersData;
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
};

export const getPlayerName = async (id_player, tournamentId) => {
  const currentYear = new Date().getFullYear().toString();
  try {
    const playerQuery = query(
      collection(
        firestore,
        "I_Torneos",
        currentYear,
        "Tournaments",
        tournamentId,
        "I_Players"
      ),
      where("idPlayer", "==", id_player)
    );
    const playerQuerySnapshot = await getDocs(playerQuery);
    if (!playerQuerySnapshot.empty) {
      const playerDoc = playerQuerySnapshot.docs[0];
      console.log(playerDoc.data().name);
      return playerDoc.data().name;
    } else {
      console.log("No such player!");
      return null;
    }
  } catch (error) {
    console.error("Error getting player:", error);
    return null;
  }
};

/**
 * Fetch all players with their respective bet count.
 *
 * @param {*} tournamentId - The ID of the tournament.
 * @returns {Promise<Object>} - An array containing objects, each object has the name and the apuestas fields.
 */
export const getPlayerBets = async (tournamentId) => {
  const currentYear = new Date().getFullYear().toString();
  try {
    // Reference to the I_Players collection
    const playerCollectionReference = collection(
      firestore,
      "I_Torneos",
      currentYear,
      "Tournaments",
      tournamentId,
      "I_Players"
    );
    const querySnapshot = await getDocs(playerCollectionReference);

    const playerBets = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        name: data.name,
        apuestas: data.apuestas || 0,
      };
    });
    return playerBets;
  } catch (error) {
    console.error("Error fetching player bets: ", error);
    throw error;
  }
};

export const updateBetCount = async (tournamentId, playerIds) => {
  const currentYear = new Date().getFullYear().toString();
  const db = firestore;

  try {
    const updates = playerIds.map(async (playerId) => {
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

        await updateDoc(playerDocRef, {
          apuestas: currentApuestas + 1,
        });

        console.log(
          `Updated apuestas for player ${playerId}: ${currentApuestas + 1}`
        );
      } else {
        console.log(`Player ${playerId} not found in I_Players collection.`);
      }
    });

    await Promise.all(updates);

    console.log("Bet counts updated successfully.");
  } catch (error) {
    console.error("Error updating apuestas:", error);
    throw error;
  }
};

export const getClasificationPlayers = async (tournamentId) => {
  const currentYear = new Date().getFullYear().toString();
  try {
    const querySnapshot = await getDocs(
      collection(
        firestore,
        "I_Torneos",
        currentYear,
        "Tournaments",
        tournamentId,
        "I_Players_Clasificacion"
      )
    );
    const playersData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { idPlayer: doc.id, ...data };
    });

    return playersData;
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
};

export const getOrderByPlayer = async (tournamentId, playerId) => {
  const currentYear = new Date().getFullYear().toString();
  try {
    const querySnapshot = await getDocs(
      collection(
        firestore,
        "I_Torneos",
        currentYear,
        "Tournaments",
        tournamentId,
        "I_Cuartos"
      )
    );

    const playerData = querySnapshot.docs.find((doc) => doc.id === playerId);
    if (!playerData) {
      throw new Error(`Player not found with id: `, playerId);
    }

    return playerData.data().order;
  } catch (error) {
    console.error("Error fetching player order:", error);
    throw error;
  }
};

export const fetchBracketPlayers = async (tournamentId, collectionName) => {
  try {
    const year = new Date().getFullYear().toString();
    const q = query(
      collection(
        firestore,
        "I_Torneos",
        year,
        "Tournaments",
        tournamentId,
        collectionName
      ),
      orderBy("order")
    );

    const querySnapshot = await getDocs(q);

    const playersData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        name: data.name,
        order: data.order,
      };
    });

    return playersData;
  } catch (error) {
    console.error("Error fetching bracket players:", error);
    throw error;
  }
};

export const fetchTournamentWinner = async (tournamentId) => {
  try {
    const year = new Date().getFullYear().toString();
    const winnerDocRef = query(
      collection(
        firestore,
        "I_Torneos",
        year,
        "Tournaments",
        tournamentId,
        "I_Resultados"
      ),
      orderBy("rank", "asc")
    );

    const querySnapshot = await getDocs(winnerDocRef);
    if (querySnapshot.empty) {
      throw new Error("No winner found");
    }
    const winnerDoc = querySnapshot.docs[0];
    return winnerDoc.data().name;
  } catch (error) {
    console.error("Error fetching tournament winner:", error);
    throw error;
  }
};
