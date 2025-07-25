import { fetchScoreSheet } from "../firestore/utils";

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

const isMatchOver = async (score) => {
  if (!score.stillPlaying) {
    return;
  }

  if (score.holesRemaining < Math.abs(score.result)) {
    console.log("Score is: ", score);
    return true;
  }
  return false;
};

export const compareScores = async (
  id_player1,
  id_player2,
  tournamentName,
  collectionName
) => {
  const scoreSheet1 = await fetchScoreSheet(
    id_player1,
    tournamentName,
    collectionName
  );
  const scoreSheet2 = await fetchScoreSheet(
    id_player2,
    tournamentName,
    collectionName
  );

  let score = {
    currentHole: 1,
    holesPlayed: 0,
    holesRemaining: 18,
    result: 0,
    stillPlaying: true,
    matchWonAtHole: null,
    resultAtWin: null,
  };

  if (scoreSheet1 === null || scoreSheet2 === null) {
    return null;
  }

  while (score.currentHole <= 18) {
    const currentHoleKey = `H${score.currentHole.toString().padStart(2, "0")}`;
    const score1 = scoreSheet1[currentHoleKey];
    const score2 = scoreSheet2[currentHoleKey];

    if (score1 === 0 || score2 === 0) {
      score.currentHole++;
      continue;
    }

    if (score1 === score2) {
      score.holesPlayed++;
      score.holesRemaining--;
      score.currentHole++;
      if (await isMatchOver(score)) {
        score.stillPlaying = false;
        score.matchWonAtHole = score.currentHole - 1;
        score.resultAtWin = score.result;
      }
      continue;
    }

    if (score1 < score2) {
      score.result--;
      score.holesPlayed++;
      score.holesRemaining--;
      score.currentHole++;
      if (await isMatchOver(score)) {
        score.stillPlaying = false;
        score.matchWonAtHole = score.currentHole - 1;
        score.resultAtWin = score.result;
      }
      continue;
    }

    if (score1 > score2) {
      score.result++;
      score.holesPlayed++;
      score.holesRemaining--;
      score.currentHole++;
      if (await isMatchOver(score)) {
        score.stillPlaying = false;
        score.matchWonAtHole = score.currentHole - 1;
        score.resultAtWin = score.result;
      }
      continue;
    }

    score.currentHole++;
  }

  if (score.holesPlayed === 18) {
    score.stillPlaying = false;
  }

  if (score.result === 0 && score.stillPlaying === false) {
    for (let i = 1; i <= 18; i++) {
      const currentHoleKey = `H${i.toString().padStart(2, "0")}`;
      const score1 = scoreSheet1[currentHoleKey];
      const score2 = scoreSheet2[currentHoleKey];
      score.matchWonAtHole = null;

      if (score1 < score2) {
        score.result--;
        break;
      }
      if (score1 > score2) {
        score.result++;
        break;
      }
    }
  }

  return score;
};

export const showResults = (results, player_name1, player_name2) => {
  if (results === null) {
    return "";
  }

  if (results.stillPlaying) {
    if (results.result === 0) {
      return `All Square, ${results.holesRemaining} holes remaining`;
    }

    if (results.result > 0) {
      return `${results.result}d ${results.holesRemaining} holes remaining ${results.result} u`;
    }

    if (results.result < 0) {
      return `${results.result * -1}u ${results.holesRemaining} holes remaining ${results.result * -1}d`;
    }
  } else {
    if (results.result === 0) {
      return `All Square`;
    }

    if (results.result > 0) {
      return `${player_name1} won by a difference of ${results.result} holes`;
    }

    if (results.result < 0) {
      return `${player_name2} won by a difference of ${results.result * -1} holes`;
    }
  }

  return results.result;
};

export const fetchResults = async (tournamentId) => {
  try {
    const currentYear = new Date().getFullYear().toString();
    const finalsCollectionRef = collection(
      firestore,
      "I_Torneos",
      currentYear,
      "Tournaments",
      tournamentId,
      "I_Resultados"
    );

    const q = query(finalsCollectionRef, orderBy("Rank"));
    const querySnapshot = await getDocs(q);
    const names = [];

    if (querySnapshot.empty) {
      console.log("No documents found in the I_Resultados collection.");
      return names;
    }

    querySnapshot.forEach((doc) => {
      const matchData = doc.data();
      if (matchData && matchData.name) {
        names.push(matchData.name);
      } else {
        console.log(`No name field in document ${doc.id}.`);
      }
    });

    return names;
  } catch (error) {
    console.error("Error fetching final results:", error);
    throw error;
  }
};
