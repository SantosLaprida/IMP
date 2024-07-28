import {
  collection,
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

export const processSemis = async (
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
      "I_Semis_resultados"
    );
    const semisSnapshot = await getDocs(semisCollectionRef);

    if (semisSnapshot.empty) {
      await setDoc(doc(semisCollectionRef, "Match1"), {});
      await setDoc(doc(semisCollectionRef, "Match2"), {});
    }

    const winnerId = result < 0 ? id_player1 : id_player2;
    const loserId = result < 0 ? id_player2 : id_player1;

    const winnerInfo = await getPlayerName(winnerId, tournamentId);
    const loserInfo = await getPlayerName(loserId, tournamentId);

    if (!winnerInfo || !loserInfo) {
      throw new Error("Player not found");
    }

    const [winnerName, winnerOrder] = winnerInfo;
    const matchDocId =
      winnerOrder === 1 || winnerOrder === 4 ? "Match1" : "Match2";
    const matchDocRef = doc(semisCollectionRef, matchDocId);

    const matchDocSnapshot = await getDoc(matchDocRef);
    if (!matchDocSnapshot.exists() || !matchDocSnapshot.data().id_player) {
      await updateDoc(matchDocRef, {
        name: winnerName,
        id_player: winnerId,
      });
      console.log(`Player ${winnerName} stored in ${matchDocId}`);
    } else {
      console.log(
        `Match ${matchDocId} already has a winner: ${matchDocSnapshot.data().name}`
      );
    }

    const finalesCollectionRef = collection(
      firestore,
      "I_Torneos",
      tournamentId,
      "I_Finales"
    );
    const finalesSnapshot = await getDocs(finalesCollectionRef);

    if (finalesSnapshot.empty) {
      const playerFinaleDoc = {
        id_player: winnerId,
        name: winnerName,
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
      await addDoc(finalesCollectionRef, playerFinaleDoc);
      console.log(`Finale document created for player ${winnerName}`);
    } else {
      console.log("Finales collection already exists, doing nothing.");
    }

    const tercerCuartoCollectionRef = collection(
      firestore,
      "I_Torneos",
      tournamentId,
      "I_TercerCuarto"
    );
    const tercerCuartoQuery = query(
      tercerCuartoCollectionRef,
      where("id_player", "==", loserId)
    );
    const tercerCuartoSnapshot = await getDocs(tercerCuartoQuery);

    if (tercerCuartoSnapshot.empty) {
      const loserFinaleDoc = {
        id_player: loserId,
        name: loserInfo[0],
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
      await addDoc(tercerCuartoCollectionRef, loserFinaleDoc);
      console.log(`TercerCuarto document created for player ${loserInfo[0]}`);
    } else {
      console.log(
        "TercerCuarto collection already has an entry for this player, doing nothing."
      );
    }
  } catch (error) {
    console.error("Error processing semifinals:", error);
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
