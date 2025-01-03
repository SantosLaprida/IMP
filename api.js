// 10.0.0.112   my ip address
// 192.168.0.14  car's ip address
import { registerUser, loginUser } from "./server/firestoreFunctions";
import { sendPasswordReset } from "./server/firestoreFunctions";
import { checkIfSemisExist } from "./server/firestoreFunctions";
import { fetchBracket } from "./server/firestoreFunctions";

//import { fetchPlayers as fetchPlayersFromFirestore, storeTeam as storeTeamInFirestore } from './server/firestoreFunctions';
import {
  fetchPlayersFromFirestore,
  storeTeamInFirestore,
  fetchTeamFromFirestore,
} from "./server/firestoreFunctions";

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
