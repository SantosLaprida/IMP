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

export const storeTeam = async (userId, team, tournamentId) => {
  const currentYear = new Date().getFullYear().toString();
  try {
    const teamDocRef = doc(
      firestore,
      "I_Torneos",
      currentYear,
      "Tournaments",
      tournamentId,
      "I_Apuestas",
      userId // The document ID is the userId
    );

    // Create an object to store the players in the format { player1: playerId1, player2: playerId2, ... }
    const teamData = {};

    team.forEach((playerId, index) => {
      teamData[`player${index + 1}`] = playerId;
    });

    // Store the team data in Firestore
    await setDoc(teamDocRef, teamData);

    console.log("Team stored successfully");
  } catch (error) {
    console.error("Error storing team:", error);
    throw error;
  }
};

export const fetchTeam = async (tournamentId, userId) => {
  const currentYear = new Date().getFullYear().toString();
  try {
    const teamDocRef = doc(
      firestore,
      "I_Torneos",
      currentYear,
      "Tournaments",
      tournamentId,
      "I_Apuestas",
      userId // The document ID is the userId
    );

    const teamDoc = await getDoc(teamDocRef);

    if (teamDoc.exists()) {
      return teamDoc.data(); // Return the team data if the document exists
    } else {
      console.log("No team found for this user.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching team:", error);
    throw error;
  }
};

export const getAmountOfUserBets = async (tournamentId) => {
  const year = new Date().getFullYear().toString();
  try {
    const querySnapshot = await getDocs(
      collection(
        firestore,
        "I_Torneos",
        year,
        "Tournaments",
        tournamentId,
        "I_Apuestas"
      )
    );
    const userBets = querySnapshot.size;
    if (userBets === 0) {
      console.log("No bets found for this tournament.");
    }

    console.log(
      `Number of user bets for tournament ${tournamentId}:`,
      userBets
    );
    return userBets;
  } catch (error) {
    console.error("Error fetching user bets:", error);
    throw error;
  }
};
