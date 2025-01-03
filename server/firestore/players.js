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

const firestore = getFirestore();

export const fetchPlayersFromFirestore = async (tournamentId) => {
  try {
    const querySnapshot = await getDocs(
      collection(firestore, "I_Torneos", tournamentId, "I_Players")
    );
    const playersData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { id_player: doc.id, ...data };
    });
    return playersData;
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
};

export const getPlayerName = async (id_player, tournamentId) => {
  try {
    const playerQuery = query(
      collection(firestore, "I_Torneos", tournamentId, "I_Players"),
      where("id_player", "==", id_player)
    );
    const playerQuerySnapshot = await getDocs(playerQuery);
    if (!playerQuerySnapshot.empty) {
      const playerDoc = playerQuerySnapshot.docs[0];
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
  try {
    // Reference to the I_Players collection
    const playerCollectionReference = collection(
      firestore,
      "I_Torneos",
      tournamentId,
      "I_Players"
    );
    const querySnapshot = await getDocs(playerCollectionReference);

    const playerBets = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        name: doc.id,
        apuestas: data.apuestas || 0,
      };
    });
    return playerBets;
  } catch (error) {
    console.error("Error fetching player bets: ", error);
    throw error;
  }
};

export const updateBetCount = async (tournamentId, playerNames) => {
  try {
    const db = firestore;

    for (const playerName of playerNames) {
      // Reference the specific player document in the I_Players collection
      const playerDocRef = doc(
        db,
        "I_Torneos",
        tournamentId,
        "I_Players",
        playerName
      );

      // Fetch the document to check if it exists and get the current apuestas field
      const playerDocSnap = await getDoc(playerDocRef);

      if (playerDocSnap.exists()) {
        const currentData = playerDocSnap.data();
        const currentApuestas = currentData.apuestas || 0;

        // Increment apuestas by 1
        await updateDoc(playerDocRef, {
          apuestas: currentApuestas + 1,
        });

        console.log(
          `Updated apuestas for player ${playerName}: ${currentApuestas + 1}`
        );
      } else {
        console.log(`Player ${playerName} not found in I_Players collection.`);
      }
    }

    console.log("Bet counts updated successfully.");
  } catch (error) {
    console.error("Error updating apuestas:", error);
    throw error;
  }
};
