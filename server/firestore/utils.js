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

export const fetchScoreSheet = async (
  id_player,
  tournamentName,
  collectionName
) => {
  try {
    const scoreQuery = query(
      collection(firestore, "I_Torneos", tournamentName, collectionName),
      where("id_player", "==", id_player)
    );
    const querySnapshot = await getDocs(scoreQuery);
    let scoreData = {};
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      for (const key in data) {
        if (/^H(0[1-9]|1[0-8])$/.test(key)) {
          scoreData[key] = data[key];
        }
      }
    });

    const name = await getPlayerName(id_player, tournamentName);
    return scoreData;
  } catch (error) {
    console.error("Error fetching score sheet:", error);
    throw error;
  }
};

/**
 * Fetch hole data (H01 to H18) for two players in a tournament.
 *
 * @param {*} tournamentId - The ID of the tournament.
 * @param {*} collectionName - The name of the collection (e.g., "Players").
 * @param {*} id_player1 - ID of the first player.
 * @param {*} id_player2 - ID of the second player.
 * @returns {Promise<Object>} - An object containing two arrays, one for each player's hole data.
 */
export const getHoles = async (
  tournamentId,
  collectionName,
  id_player1,
  id_player2
) => {
  try {
    // Collection reference to the players in the tournament
    const playersCollection = collection(
      firestore,
      "I_Torneos",
      tournamentId,
      collectionName
    );

    // Query to get player 1 and player 2 documents
    const q = query(
      playersCollection,
      where("id_player", "in", [id_player1, id_player2])
    );
    const querySnapshot = await getDocs(q);

    // Initialize arrays to store hole data for both players
    let player1Holes = [];
    let player2Holes = [];
    let response = {};

    // Loop through the returned documents
    querySnapshot.forEach((doc) => {
      const playerData = doc.data();

      // Extract the hole data (H01 to H18) into an array
      const holes = [];
      for (let i = 1; i <= 18; i++) {
        const holeNumber = i < 10 ? `H0${i}` : `H${i}`;
        holes.push(playerData[holeNumber]);
      }

      // Assign the hole data to the respective player
      if (playerData.id_player === id_player1) {
        player1Holes = holes;
        response.player1 = player1Holes;
      } else if (playerData.id_player === id_player2) {
        player2Holes = holes;
        response.player2 = player2Holes;
      }
    });

    // Return the two arrays (holes for player 1 and player 2)
    console.log(response);
    return {
      player1Holes,
      player2Holes,
    };
  } catch (error) {
    console.error("Error fetching hole data:", error);
    throw error;
  }
};

export const getUserById = async (uid) => {
  try {
    const userDoc = await getDoc(doc(firestore, "I_Members", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};
