// 10.0.0.112   my ip address
// 192.168.0.14  car's ip address
import { registerUser, loginUser } from './server/firestoreFunctions';
import { sendPasswordReset } from './server/firestoreFunctions';
import { fetchScoreSheet } from './server/firestoreFunctions';
import { checkIfSemisExist } from './server/firestoreFunctions';

//import { fetchPlayers as fetchPlayersFromFirestore, storeTeam as storeTeamInFirestore } from './server/firestoreFunctions';
import { fetchPlayersFromFirestore, storeTeamInFirestore, fetchTeamFromFirestore } from './server/firestoreFunctions';

const publicIp = 'http://192.168.1.40:3000'; 

export const registerUserAPI = async (email, password, firstName, lastName) => {
  try {
    const user = await registerUser(email, password, firstName, lastName);
    return user;
  } catch (error) {
    console.error('Error in registerUserAPI:', error);
    throw error;
  }
};

export const loginUserAPI = async (email, password) => {
  try {
    const user = await loginUser(email, password);
    return user;
  } catch (error) {
    console.error('Error in loginUserAPI:', error);
    throw error;
  }
};

export const sendPasswordResetAPI = async (email) => {
  try {
    await sendPasswordReset(email);
    return 'Password reset email sent';
  } catch (error) {
    console.error('Error in sendPasswordResetAPI:', error);
    throw error;
  }
};

export const fetchPlayers = async () => {
  try {
    const players = await fetchPlayersFromFirestore();
    return players;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

export const storeTeam = async (userId, team) => {
  try {
    await storeTeamInFirestore(userId, team);
  } catch (error) {
    console.error('Error storing team:', error);
    throw error;
  }
};

export const fetchTeamAPI = async (userId) => {
  try {
    const team = await fetchTeamFromFirestore(userId);
    console.log(team);
    return team;
  } catch (error) {
    console.error('Error fetching team:', error);
    throw error;
  }
};

export const get_name_by_id = (players, ids) => {
  const result = {};

  ids.forEach(id => {
    const player = players.find(player => player.id_player === id);
    if (player) {
      result[id] = player.name;
    }
  });

  return result;
};


export const getScoreSheet = async (id_player, tournamentName, collectionName) => {

  try {
    const scoreSheet = await fetchScoreSheet(id_player, tournamentName, collectionName);
    return scoreSheet;
  } catch (error) {
    console.error('Error fetching score sheet:', error);
    throw error;
  }
}


export const semisExistsAPI = async (tournamentId) => {

  try {
    const semisExist = await checkIfSemisExist(tournamentId);
    if (semisExist) {
      return false;
    }
    return true;

  } catch (error) {
    console.error('Error checking if semis exist:', error);
    throw error;
  }
};






















































export const checkIfEmailExistsAPI = async (email) => {

  console.log("Inside checkIfEmailExistsAPI in api.js");

  try {
    const emailExists = await checkIfEmailExists(email);
    return emailExists ? 'Email is taken' : 'Email is available';
  } catch (error) {
    console.error('Error:', error);
    return 'Error checking email';
  }
};


export const checkIfUserExistsAPI = async (email, password) => {
  console.log("Inside checkIfUserExistsAPI in api.js");

  try {
    const userData = await checkIfUserExists(email, password);
    if (userData) {
      alert('Login successful');
      return userData;
    } else {
      alert('Login failed');
      return false;
    }
  } catch (error) {
    console.error('Error in checkIfUserExistsAPI:', error);
    return false;
  }
};














































// export const checkIfEmailExists = async (email) => {
//   try {
//     const response = await fetch(`${publicIp}/users/email/${email}`);
//     const data = await response.text();
//     return data === 'Email is taken';
//   } catch (error) {
//     console.error('Error:', error);
//     return false;
//   }
// };




  // export const fetchPlayers = async () => {
  
  //   try {
  //     const response = await fetch(`${publicIp}/players`);
  
  //     if (!response.ok) throw new Error('Public API failed');
      
  //     const data = await response.json();
  //     console.log(data);
  //     return data;
  
  //   } catch (error) {
  //     console.error('Public API call failed:', error);
  //     throw error;
  //   }
  // };

// export const checkIfUserExists = async (email, password) => {

//   try {
//     const response = await fetch(`${publicIp}/users/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     if (!response.ok) throw new Error('Public API failed');
    
//     const data = await response.json();

//     if(data.message === 'Login successful') {
//       alert('Login successful');
//       return data.user;
//     } else {
//       alert('Login failed');
//       return false;
//     }

//   } catch (error) {
//     console.error('Public API call failed:', error);
//     return false;
//   }
// };


  /**
   * Sends a POST request to the server with the team selected (EQUIPO)
   * @param {Array} equipo - The team selected by the user and the user ID
   * @returns {Promise} - The response from the server
   */
//   export const storeTeam = async (userId, equipo) => {

//     try {
//       const response = await fetch(`${publicIp}/teams`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ userId, equipo }),
//       });
  
//       const data = await response.json();
  
//       if(response.status === 409) {
//         alert('Team already stored for this user');
//         return false;
//       } else if (!response.ok) {
//         throw new Error('Public API failed');
//       } else if(data.message === 'Team stored') {
//         alert('Team stored');
//         return data;
//       } else {
//         alert('Team not stored');
//         return false;
//       }
  
//     } catch (error) {
//       console.error('Public API call failed:', error);
//       return false;
//     }
//   };


//   export const retrieveTeam = async (userId) => {

//     console.log("Inside getTeam in api");
//     console.log(userId);
//     console.log(`${publicIp}/getTeam/${userId}`);

//     try {
//       const response = await fetch(`${publicIp}/getTeam/${userId}`);
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error:', error);
//       return false;
//     }
//   };


//   export const get_name_by_id = (players, ids) => {

//     result = {};

//     for(let i = 0; i < ids.length; i++) {
    
//       const player = players.find((player) => player.id_player === ids[i]);
//       result[ids[i]] = player.name;

//     }
//     return result;

// }
  