import { fetchPlayers, storeTeam, fetchTeamAPI } from '../api';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../server/firebaseConfig';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Players = ({ navigation }) => {
  const [equipo, setEquipo] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [originalJugadores, setOriginalJugadores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPlayers();
        setJugadores(data);
        setOriginalJugadores(data);

        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const userTeam = await fetchTeamAPI(userId);
          if (userTeam) {
            const mappedTeam = userTeam.map(teamMember => {
              return data.find(player => player.id_player === teamMember.id_player);
            }).filter(player => player);
            setEquipo(mappedTeam);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const agregarJugadorAlEquipo = (jugador) => {
    if (equipo.length >= 8) {
      alert('You can only select a maximum of 8 players.');
      return;
    }
    setEquipo((prevEquipo) => [...prevEquipo, jugador]);
    setJugadores((prevJugadores) => prevJugadores.filter((j) => j.id_player !== jugador.id_player));
  };

  const quitarJugadorDelEquipo = (jugador) => {
    setEquipo((prevEquipo) => prevEquipo.filter((j) => j.id_player !== jugador.id_player));
    setJugadores((prevJugadores) => [...prevJugadores, jugador]);
  };

  const handleFinish = async () => {
    
    if (equipo.length < 8) {
      alert('Please select at least 8 players');
      return;
    }

    const userId = await retrieveUser();
    console.log('User ID:', userId);
    
    const playersIds = equipo.map((jugador) => jugador.id_player);
    console.log('Team:', playersIds);

    try {
      await storeTeam(userId, playersIds);
      console.log('Team stored successfully');
      alert("Bet placed succesfully")
    } catch (error) {
      console.error('Failed to store team:', error);
    }

    await AsyncStorage.setItem('equipo', JSON.stringify(equipo));
    setEquipo([]);
    setJugadores(originalJugadores);
  };

  const retrieveUser = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user !== null) {
        return JSON.parse(user).uid; // Use the UID instead of id_member
      }
    } catch (error) {
      console.error(error);
    }
  };

  const teamPlayerIds = new Set(equipo.map(player => player.id_player));

  const filteredJugadores = jugadores.filter((jugador) =>
    !teamPlayerIds.has(jugador.id_player) && 
    (jugador.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jugador.rank.toString().includes(searchTerm))
  );

  return (
    <LinearGradient
    colors={['#1f3a5c', 'white']}
    locations={[0, 0.5]}
    style={styles.container}>
 
      <View style={styles.box}>
        <Text style={{ ...styles.text, fontSize: 15, marginTop: -5, paddingBottom: 10 }}>Choose 8 players</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setSearchTerm(text)}
          value={searchTerm}
          placeholder="Search players"
          placeholderTextColor="#1f3a5c"
        />
        <View style={styles.itemTitle}>
          <Text style={styles.text}>Player</Text>
          <Text style={styles.text}>Ranking</Text>
        </View>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {filteredJugadores.map((jugador) => (
            <TouchableOpacity key={jugador.id_player} onPress={() => agregarJugadorAlEquipo(jugador)}>
              <View style={{ ...styles.jugadorItem, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{...styles.text, fontSize: 11}}>{jugador.name}</Text>
                <Text style={{...styles.text, fontSize: 11}}>{jugador.rank}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={{ ...styles.box, height: 250 }}>
        
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.itemTitle}>
          <Text style={styles.text}>Your team</Text>
          <Text style={styles.text}>{"N° of players: " + equipo.length}</Text>
         
        </View>
          {equipo.map((jugador) => (
            <TouchableOpacity key={jugador.id_player} onPress={() => quitarJugadorDelEquipo(jugador)}>
              <View style={{ ...styles.jugadorItem, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{...styles.text, fontSize: 11}} >{jugador.name}</Text>
                <Text style={{...styles.text, fontSize: 11}}>{jugador.rank}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.btns}>
      <TouchableOpacity style={styles.button} onPress={handleFinish}>
        <Text style={styles.buttonText}>Place my bet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Bets')}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  box: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: 'rgb(255, 252, 241)',
    height: 350,
    marginBottom: 10,
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 6, // Radio de la sombra
    // Para Android
    elevation: 10, // Elevación para la sombra
  },
  itemTitle: {
    borderRadius: 5,
    width: 250,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  jugadorItem: {
    padding: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: 250,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(216, 203, 132, 0.664)',
    justifyContent: "center"
  },
  text: {
    fontSize: 13,
    textAlign: "left",
    fontWeight: "700",
    color: "#1f3a5c",
  },
  btn: {
    width: 300,
    borderRadius: 20,
    fontFamily: "Roboto",
  },
  scroll: {
    width: 250,
  },
  input: {
    width: 250,
    borderColor: '#1f3a5c',
    borderWidth: 1,
    padding: 5,
    color: 'white',
    borderRadius: 5,
    height: 30
  },
  button: {
    backgroundColor: '#17628b34',
    padding: 8,
    margin: 10,
    borderRadius: 10,
    width: 170, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#17628b94',
    borderBottomWidth: 7, 
    borderBottomColor: 'rgba(0, 0, 0, 0.2)', 
  },
  buttonText: {
    color: '#1f3a5c',
    fontSize: 18,
    fontWeight: "500"
  },
  btns:{
    flexDirection: "row"
  }
});

export default Players;
