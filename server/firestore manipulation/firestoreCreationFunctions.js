import { collection, deleteDoc, updateDoc, getDocs, query, where, doc, setDoc, getDoc, addDoc, getFirestore } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const firestore = getFirestore();

export const createI_Players = async (tournamentId, start_date, finish_date, logo, players) => {
    if (!Array.isArray(players)) {
      throw new TypeError("The 'players' parameter must be an array");
    }
  
    // Create the I_Torneos document with the specified fields
    const tournamentRef = doc(firestore, 'I_Torneos', tournamentId);
    await setDoc(tournamentRef, {
      activo: 1,
      start_date: start_date,
      finish_date: finish_date,
      logo: logo
    });
  
    // Create the I_Players collection within the tournament document
    const collectionRef = collection(tournamentRef, 'I_Players');
  
    for (const player of players) {
      if (player.name && player.rank !== undefined) {
        const docRef = doc(collectionRef, player.name);
        await setDoc(docRef, {
          id_player: docRef.id,
          name: player.name,
          rank: player.rank,
        });
      } else {
        console.error('Invalid player object', player);
      }
    }
  };

  export const createI_Cuartos = async (tournamentId) => {
    try {
      const collectionRef = collection(firestore, 'I_Torneos', tournamentId, 'I_Cuartos');
  
      for (let i = 1; i <= 8; i++) {
        const cuartoData = {
          H1: 0, H2: 0, H3: 0, H4: 0, H5: 0, H6: 0,
          H7: 0, H8: 0, H9: 0, H10: 0, H11: 0, H12: 0,
          H13: 0, H14: 0, H15: 0, H16: 0, H17: 0, H18: 0,
          id_player: 0,
          orden: 0
        };
        await addDoc(collectionRef, cuartoData);
      }
      console.log('I_Cuartos created successfully.');
    } catch (error) {
      console.error('Error creating I_Cuartos:', error);
    }
  };