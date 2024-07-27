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

export const processCuartos = async (
  tournamentId,
  id_player1,
  id_player2,
  result
) => {
  try {
    const semisCollectionRef = collection(
      firestore,
      "I_Torneos",
      tournamentId,
      "I_Cuartos_resultados"
    );
    const semisSnapshot = await getDocs(semisCollectionRef);

    if (semisSnapshot.empty) {
      await setDoc(doc(semisCollectionRef, "Match1"), {});
      await setDoc(doc(semisCollectionRef, "Match2"), {});
      await setDoc(doc(semisCollectionRef, "Match3"), {});
      await setDoc(doc(semisCollectionRef, "Match4"), {});
    }

    const playerId = result < 0 ? id_player1 : id_player2;
    const playerInfo = await getPlayerName(playerId, tournamentId);

    if (!playerInfo) {
      throw new Error("Player not found");
    }

    const [playerName, playerOrder] = playerInfo;

    if (playerOrder === 1 || playerOrder === 8) {
      const matchDocId = "Match1";
      const matchDocRef = doc(semisCollectionRef, matchDocId);
      await updateDoc(matchDocRef, {
        name: playerName,
        id_player: playerId,
      });
      console.log(`Player ${playerName} stored in ${matchDocId}`);
    } else if (playerOrder === 2 || playerOrder === 7) {
      const matchDocId = "Match2";
      const matchDocRef = doc(semisCollectionRef, matchDocId);
      await updateDoc(matchDocRef, {
        name: playerName,
        id_player: playerId,
      });
      console.log(`Player ${playerName} stored in ${matchDocId}`);
    } else if (playerOrder === 3 || playerOrder === 6) {
      const matchDocId = "Match3";
      const matchDocRef = doc(semisCollectionRef, matchDocId);
      await updateDoc(matchDocRef, {
        name: playerName,
        id_player: playerId,
      });
      console.log(`Player ${playerName} stored in ${matchDocId}`);
    } else if (playerOrder === 4 || playerOrder === 5) {
      const matchDocId = "Match4";
      const matchDocRef = doc(semisCollectionRef, matchDocId);
      await updateDoc(matchDocRef, {
        name: playerName,
        id_player: playerId,
      });
      console.log(`Player ${playerName} stored in ${matchDocId}`);
    }

    const semiCollectionRef = collection(
      firestore,
      "I_Torneos",
      tournamentId,
      "I_Semifinales"
    );
    const semifinalesSnapshot = await getDocs(semiCollectionRef);

    if (semifinalesSnapshot.size < 4) {
      const playerFinaleDoc = {
        id_player: playerId,
        name: playerName,
        H1: 0,
        H2: 0,
        H3: 0,
        H4: 0,
        H5: 0,
        H6: 0,
        H7: 0,
        H8: 0,
        H9: 0,
        H10: 0,
        H11: 0,
        H12: 0,
        H13: 0,
        H14: 0,
        H15: 0,
        H16: 0,
        H17: 0,
        H18: 0,
      };
      await addDoc(semiCollectionRef, playerFinaleDoc);
      console.log(`Finale document created for player ${playerName}`);
    } else {
      console.log("Finales collection already exists, doing nothing.");
    }
  } catch (error) {
    console.error("Error processing semifinals:", error);
  }
};

const getPlayerName = async (id_player, tournamentId) => {
  // Get the player name by id, path is I_Torneos, then the tournamentId, then I_Cuartos.
  // We get the document that has the id_player as the id, and return the name field

  try {
    const playerQuery = query(
      collection(firestore, "I_Torneos", tournamentId, "I_Cuartos"),
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
