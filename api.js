// 10.0.0.112   my ip address
// 192.168.0.14  car's ip address

const localIp = 'http://192.168.1.39:3000'; // Car's IP
const publicIp = 'http://10.0.0.112:3000'; // Your IP

function racePromisesIgnoreRejections(promises) {
    let indexPromises = promises.map((p, index) => p.catch(() => { throw index; }));
    let indexRace = Promise.race(indexPromises);
    return indexRace.then(index => {
      let p = promises[index];
      promises.splice(index, 1);
      return p.catch(() => racePromisesIgnoreRejections(promises));
    });
  }


export const fetchPlayers = async () => {
    // Create fetch promises for both local and public IPs
    const localFetch = fetch(`${localIp}/players`).then(response => {
        if (!response.ok) throw new Error('Local API failed');
        return response.json();
    });

    const publicFetch = fetch(`${publicIp}/players`).then(response => {
        if (!response.ok) throw new Error('Public API failed');
        return response.json();
    });

    try {
        // Use Promise.race to attempt both fetches concurrently and return the first successful one
        const data = await Promise.race([localFetch, publicFetch]);
        return data;
    } catch (error) {
        console.error('Both local and public API calls failed:', error);
        throw error;
    }
};

export const checkIfUserExists = async (email, password) => {
    // Create fetch promises for both local and public IPs
    const localFetch = fetch(`${localIp}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }).then(response => {
      if (!response.ok) throw new Error('Local API failed');
      return response.json();
    });
  
    const publicFetch = fetch(`${publicIp}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }).then(response => {
      if (!response.ok) throw new Error('Public API failed');
      return response.json();
    });
  
    try {
      // Use Promise.race to attempt both fetches concurrently and return the first successful one
      const data = await Promise.race([localFetch, publicFetch]);
      if(data.message === 'Login successful') {
        alert('Login successful');
        return data.user;

      } else {
        alert('Login failed');
        return false;
      }
    } catch (error) {
      console.error('Both local and public API calls failed:', error);
      return false;
    }
  };