// 10.0.0.112   my ip address
// 192.168.0.14  car's ip address

const publicIp = 'http://192.168.1.40:3000'; // Your IP

// function racePromisesIgnoreRejections(promises) {
//     let indexPromises = promises.map((p, index) => p.catch(() => { throw index; }));
//     let indexRace = Promise.race(indexPromises);
//     return indexRace.then(index => {
//       let p = promises[index];
//       promises.splice(index, 1);
//       return p.catch(() => racePromisesIgnoreRejections(promises));
//     });
//   }


export const checkIfEmailExists = async (email) => {
  try {
    const response = await fetch(`${publicIp}/users/email/${email}`);
    const data = await response.text();
    return data === 'Email is taken';
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};




  export const fetchPlayers = async () => {
  
    try {
      const response = await fetch(`${publicIp}/players`);
  
      if (!response.ok) throw new Error('Public API failed');
      
      const data = await response.json();
      console.log(data);
      return data;
  
    } catch (error) {
      console.error('Public API call failed:', error);
      throw error;
    }
  };

export const checkIfUserExists = async (email, password) => {

  try {
    const response = await fetch(`${publicIp}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error('Public API failed');
    
    const data = await response.json();

    if(data.message === 'Login successful') {
      alert('Login successful');
      return data.user;
    } else {
      alert('Login failed');
      return false;
    }

  } catch (error) {
    console.error('Public API call failed:', error);
    return false;
  }
};


  /**
   * Sends a POST request to the server with the team selected (EQUIPO)
   * @param {Array} equipo - The team selected by the user and the user ID
   * @returns {Promise} - The response from the server
   */
  export const storeTeam = async (userId, equipo) => {

    try {
      const response = await fetch(`${publicIp}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, equipo }),
      });
  
      const data = await response.json();
  
      if(response.status === 409) {
        alert('Team already stored for this user');
        return false;
      } else if (!response.ok) {
        throw new Error('Public API failed');
      } else if(data.message === 'Team stored') {
        alert('Team stored');
        return data;
      } else {
        alert('Team not stored');
        return false;
      }
  
    } catch (error) {
      console.error('Public API call failed:', error);
      return false;
    }
  };


  export const retrieveTeam = async (userId) => {

    console.log("Inside getTeam in api");
    console.log(userId);
    console.log(`${publicIp}/getTeam/${userId}`);

    try {
      const response = await fetch(`${publicIp}/getTeam/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };


  export const get_name_by_id = (players, ids) => {

    result = {};

    for(let i = 0; i < ids.length; i++) {
    
      const player = players.find((player) => player.id_player === ids[i]);
      result[ids[i]] = player.name;

    }
    return result;

}
  