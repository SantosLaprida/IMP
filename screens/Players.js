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
    jugador.ranking.toString().includes(searchTerm))
  );

  return (
    <LinearGradient colors={['#0d1825', '#2e4857']} style={styles.container}>
      <TouchableOpacity style={{ ...styles.button, marginBottom: 20 }} onPress={() => navigation.navigate('Tournaments')}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.box}>
        <Text style={{ ...styles.text, paddingBottom: 10, fontSize: 20 }}>Choose your players</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setSearchTerm(text)}
          value={searchTerm}
          placeholder="Search players"
          placeholderTextColor="white"
        />
        <View style={styles.itemTitle}>
          <Text style={styles.text}>Player</Text>
          <Text style={styles.text}>Ranking</Text>
        </View>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {filteredJugadores.map((jugador) => (
            <TouchableOpacity key={jugador.id_player} onPress={() => agregarJugadorAlEquipo(jugador)}>
              <View style={{ ...styles.jugadorItem, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>{jugador.name}</Text>
                <Text>{jugador.rank}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={{ ...styles.box, height: 200 }}>
        <Text style={{ ...styles.text, paddingBottom: 10, fontSize: 20 }}>Your team</Text>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {equipo.map((jugador) => (
            <TouchableOpacity key={jugador.id_player} onPress={() => quitarJugadorDelEquipo(jugador)}>
              <View style={styles.jugadorItem}>
                <Text>{jugador.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleFinish}>
        <Text style={styles.buttonText}>Place my bet</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  box: {
    borderWidth: 5,
    borderColor: 'teal',
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.788)',
    height: 380,
    marginBottom: 10,
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
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: 250
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
    justifyContent: "center"
  },
  text: {
    fontSize: 15,
    textAlign: "left",
    fontWeight: "700",
    color: "white",
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
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    color: 'white',
    borderRadius: 5,
    height: 30
  },
  button: {
    backgroundColor: 'rgba(212, 188, 50, 0.76)',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.80,
    shadowRadius: 3.84,
    // Sombra para Android
    elevation: 30,
  },
  buttonText: {
    color: '#15303F',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default Players;
