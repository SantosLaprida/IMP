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

export const fetchThirdPlaceQualifiers = async (tournamentName) => {
  try {
    const querySnapshot = await getDocs(
      collection(firestore, "I_Torneos", tournamentName, "I_TercerCuarto")
    );
    const sortedPlayerData = querySnapshot.docs
      .map((doc) => ({
        id_player: doc.data().id_player,
        name: doc.data().name,
        orden: doc.data().orden,
      }))
      .sort((a, b) => a.orden - b.orden);

    return sortedPlayerData.filter(({ name }) => name !== null);
  } catch (error) {
    console.error("Error fetching qualifiers:", error);
    throw error;
  }
};
