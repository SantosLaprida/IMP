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

export const fetchFinalsQualifiers = async (tournamentId) => {
  try {
    const querySnapshot = await getDocs(
      collection(firestore, "I_Torneos", tournamentId, "I_Finales")
    );
    const sortedPlayerData = querySnapshot.docs
      .map((doc) => ({
        id_player: doc.data().id_player,
        name: doc.data().name,
      }))
      .sort((a, b) => a.orden - b.orden);

    return sortedPlayerData.filter(({ name }) => name !== null);
  } catch (error) {
    console.error("Error fetching qualifiers:", error);
    throw error;
  }
};

export const processFinals = async (
  tournamentId,
  id_player1,
  id_player2,
  result
) => {
  try {
    const finalsCollectionRef = collection(
      firestore,
      "I_Torneos",
      tournamentId,
      "I_Resultados"
    );
    const finalsSnapshot = await getDocs(finalsCollectionRef);

    if (!finalsSnapshot.empty) {
      console.log("I_Resultados collection already exists");
      return;
    }

    const winnerId = result < 0 ? id_player1 : id_player2;
    const loserId = result < 0 ? id_player2 : id_player1;

    const winnerInfo = await getPlayerName(winnerId, tournamentId);
    const loserInfo = await getPlayerName(loserId, tournamentId);

    if (!winnerInfo || !loserInfo) {
      throw new Error("Player not found");
    }

    const [winnerName] = winnerInfo;
    const [loserName] = loserInfo;

    // Create Match1 and Match2 documents
    await setDoc(doc(finalsCollectionRef, "Match1"), {
      name: winnerName,
      id_player: winnerId,
    });
    console.log(`Winner ${winnerName} stored in Match1`);

    await setDoc(doc(finalsCollectionRef, "Match2"), {
      name: loserName,
      id_player: loserId,
    });
    console.log(`Loser ${loserName} stored in Match2`);
  } catch (error) {
    console.error("Error processing finals:", error);
    throw error;
  }
};

export const processThirdPlace = async (
  tournamentId,
  id_player3,
  id_player4,
  result
) => {
  try {
    const finalsCollectionRef = collection(
      firestore,
      "I_Torneos",
      tournamentId,
      "I_Resultados"
    );
    const finalsSnapshot = await getDocs(finalsCollectionRef);

    if (
      !finalsSnapshot.empty &&
      finalsSnapshot.docs.some(
        (doc) => doc.id === "Match3" || doc.id === "Match4"
      )
    ) {
      console.log("Match3 and Match4 already exist");
      return;
    }

    const winnerId = result < 0 ? id_player3 : id_player4;
    const loserId = result < 0 ? id_player4 : id_player3;

    const winnerInfo = await getPlayerName(winnerId, tournamentId);
    const loserInfo = await getPlayerName(loserId, tournamentId);

    if (!winnerInfo || !loserInfo) {
      throw new Error("Player not found");
    }

    const [winnerName] = winnerInfo;
    const [loserName] = loserInfo;

    // Create Match3 and Match4 documents
    await setDoc(doc(finalsCollectionRef, "Match3"), {
      name: winnerName,
      id_player: winnerId,
    });
    console.log(`Winner ${winnerName} stored in Match3`);

    await setDoc(doc(finalsCollectionRef, "Match4"), {
      name: loserName,
      id_player: loserId,
    });
    console.log(`Loser ${loserName} stored in Match4`);
  } catch (error) {
    console.error("Error processing third place:", error);
    throw error;
  }
};

const getPlayerName = async (id_player, tournamentId) => {
  try {
    const playerQuery = query(
      collection(firestore, "I_Torneos", tournamentId, "I_Semifinales"),
      where("id_player", "==", id_player)
    );
    const playerQuerySnapshot = await getDocs(playerQuery);
    if (!playerQuerySnapshot.empty) {
      const playerDoc = playerQuerySnapshot.docs[0];
      return [playerDoc.data().name, playerDoc.data().orden];
    } else {
      console.log("No such player!");
      return null;
    }
  } catch (error) {
    console.error("Error getting player:", error);
    return null;
  }
};

export const fetchFinalResults = async (tournamentId) => {
  try {
    const finalsCollectionRef = collection(
      firestore,
      "I_Torneos",
      tournamentId,
      "I_Resultados"
    );

    const names = [];

    // Fetch all documents in the I_Resultados collection
    const querySnapshot = await getDocs(finalsCollectionRef);

    if (querySnapshot.empty) {
      console.log("No documents found in the I_Resultados collection.");
      // Assuming you have a function to show popups, you can replace the console.log with that function
      // showPopup("No documents found in the I_Resultados collection.");
      return names; // return empty array if no documents found
    }

    querySnapshot.forEach((doc) => {
      const matchData = doc.data();
      if (matchData && matchData.name) {
        names.push(matchData.name);
      } else {
        console.log(`No name field in document ${doc.id}.`);
        // showPopup(`No name field in document ${doc.id}.`);
      }
    });

    return names;
  } catch (error) {
    console.error("Error fetching final results:", error);
    throw error;
  }
};
