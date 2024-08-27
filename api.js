// 10.0.0.112   my ip address
// 192.168.0.14  car's ip address
import { registerUser, loginUser } from "./server/firestoreFunctions";
import { sendPasswordReset } from "./server/firestoreFunctions";
import { fetchScoreSheet } from "./server/firestoreFunctions";
import { checkIfSemisExist } from "./server/firestoreFunctions";
import { fetchBracket } from "./server/firestoreFunctions";

//import { fetchPlayers as fetchPlayersFromFirestore, storeTeam as storeTeamInFirestore } from './server/firestoreFunctions';
import {
  fetchPlayersFromFirestore,
  storeTeamInFirestore,
  fetchTeamFromFirestore,
} from "./server/firestoreFunctions";

const publicIp = "http://192.168.1.40:3000";

export const registerUserAPI = async (email, password, firstName, lastName) => {
  try {
    const user = await registerUser(email, password, firstName, lastName);
    return user;
  } catch (error) {
    console.error("Error in registerUserAPI:", error);
    throw error;
  }
};

export const loginUserAPI = async (email, password) => {
  try {
    const user = await loginUser(email, password);
    return user;
  } catch (error) {
    console.error("Error in loginUserAPI:", error);
    throw error;
  }
};

export const sendPasswordResetAPI = async (email) => {
  try {
    await sendPasswordReset(email);
    return "Password reset email sent";
  } catch (error) {
    console.error("Error in sendPasswordResetAPI:", error);
    throw error;
  }
};

export const fetchPlayers = async (tournamentId) => {
  try {
    const players = await fetchPlayersFromFirestore(tournamentId);
    return players;
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
};

export const storeTeam = async (userId, team, tournamentId) => {
  try {
    await storeTeamInFirestore(userId, team, tournamentId);
  } catch (error) {
    console.error("Error storing team:", error);
    throw error;
  }
};

export const fetchTeamAPI = async (tournamentId, userId) => {
  try {
    const team = await fetchTeamFromFirestore(tournamentId, userId);
    return team;
  } catch (error) {
    console.error("Error fetching team:", error);
    throw error;
  }
};

export const get_name_by_id = (players, ids) => {
  const result = {};

  ids.forEach((id) => {
    const player = players.find((player) => player.id_player === id);
    if (player) {
      result[id] = player.name;
    }
  });

  return result;
};

export const getScoreSheet = async (
  id_player,
  tournamentName,
  collectionName
) => {
  try {
    const scoreSheet = await fetchScoreSheet(
      id_player,
      tournamentName,
      collectionName
    );
    return scoreSheet;
  } catch (error) {
    console.error("Error fetching score sheet:", error);
    throw error;
  }
};

export const semisExistsAPI = async (tournamentId) => {
  try {
    const semisExist = await checkIfSemisExist(tournamentId);
    if (semisExist) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking if semis exist:", error);
    throw error;
  }
};

export const getBracketAPI = async (tournamentId) => {
  try {
    const bracket = await fetchBracket(tournamentId);
    return bracket;
  } catch (error) {
    console.error("Error fetching bracket:", error);
    throw error;
  }
};

export const checkIfEmailExistsAPI = async (email) => {
  console.log("Inside checkIfEmailExistsAPI in api.js");

  try {
    const emailExists = await checkIfEmailExists(email);
    return emailExists ? "Email is taken" : "Email is available";
  } catch (error) {
    console.error("Error:", error);
    return "Error checking email";
  }
};

export const checkIfUserExistsAPI = async (email, password) => {
  console.log("Inside checkIfUserExistsAPI in api.js");

  try {
    const userData = await checkIfUserExists(email, password);
    if (userData) {
      alert("Login successful");
      return userData;
    } else {
      alert("Login failed");
      return false;
    }
  } catch (error) {
    console.error("Error in checkIfUserExistsAPI:", error);
    return false;
  }
};
