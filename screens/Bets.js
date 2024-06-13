import { fetchPlayers, retrieveTeam, storeTeam, get_name_by_id } from '../api';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image, Button, TouchableOpacity, TextInput } from 'react-native';

const Bets = ({ navigation }) => {

  const [equipo, setEquipo] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [originalJugadores, setOriginalJugadores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [team, setTeam] = useState([]);

  const [finalTeam, setFinalTeam] = useState([]);

  useEffect(() => {

    // const getPlayers = async () => {
    //   const data = await fetchPlayers();
    //   console.log(data);
    //   setJugadores(data);
    //   console.log(data);
    //   setOriginalJugadores(data);
    // };

    // getPlayers();

    const getTeam = async () => {

      const userId = await retrieveUser();
      const allPlayers = await fetchPlayers();

      const team = await retrieveTeam(userId);

      if (team.length === 0) {
        return;
      }

      const team_ids = team.map((player) => player.id_player);
      const final_team = get_name_by_id(allPlayers, team_ids);

      setFinalTeam(Object.values(final_team));
      
    };
      getTeam();
  }, []);

  // const agregarJugadorAlEquipo = (jugador) => {

  //   if (equipo.length >= 8) {
  //     alert('You can only select a maximum of 8 players.');
  //     return;
  //   }
    
  //   setEquipo((prevEquipo) => [...prevEquipo, jugador]);
  //   setJugadores((prevJugadores) => prevJugadores.filter((j) => j.id_player !== jugador.id_player));
  // };

  // const quitarJugadorDelEquipo = (jugador) => {

  //   const nuevoEquipo = equipo.filter((j) => j.id_player !== jugador.id_player);
  //   setEquipo(nuevoEquipo);
  //   setJugadores((prevJugadores) => [...prevJugadores, jugador]);
    
  // };

  // const handleSearch = (event) => {
  //   setSearchTerm(event.target.value);
  // };

  const retrieveUser = async () => {
    try {
      const userName = await AsyncStorage.getItem('user');
      if (userName !== null) {
        //setUser(JSON.parse(userName));
        return JSON.parse(userName).id_member;
      }
    } catch (error) {
      console.error(error);
    }
  };


  // const handleFinish = async () => {

  //   if (equipo.length < 8) {
  //     alert('Please select at least 8 players');
  //     return;
  //   }

  //   const userId = await retrieveUser();
  //   const playersIds = equipo.map((jugador) => jugador.id_player);

  //   try {
  //     await storeTeam({ userId, team: playersIds });
  //     console.log('Team stored successfully');
  //   } catch (error) {
  //     console.error('Failed to store team:', error);
  //   }

  //   await AsyncStorage.setItem('equipo', JSON.stringify(equipo));

  //   setEquipo([]);
  //   setJugadores(originalJugadores);
  // }

    

  const filteredJugadores = jugadores.filter((jugador) =>
    jugador.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ImageBackground source={require('../assets/images/fondo.jpg')} style={styles.container}>
    <View style={styles.box}>
      <Text style={{ ...styles.text, paddingBottom: 20, fontSize: 20 }}>Your bet</Text>
      <Image
    source={require('../assets/images/Golf-PGA.webp')}
    style={styles.logo}
  />
    <TouchableOpacity style={{...styles.button, width: 200, padding: 5, marginTop: 20, marginBottom: 20}} onPress={() => navigation.navigate('Matches')}>
          <Text style={{...styles.buttonText, fontSize: 15}}>See games live</Text>
        </TouchableOpacity>
      


      <ScrollView showsVerticalScrollIndicator={false}>
      
      {finalTeam.map((name, index) => (
        <View key={index} style={styles.jugadorItem}>
          <Text>{name}</Text>
        </View>
      ))}
      </ScrollView>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Players')}>
          <Text style={styles.buttonText}>Edit my team</Text>
          
        </TouchableOpacity>
    
  

  </ImageBackground>
  );
};

const styles = StyleSheet.create({
  box:{
    width: 350,
    borderWidth: 5, // ancho del borde
    borderColor: 'teal',
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.788)',
    height: 550,
    marginBottom: 25,
    
  },
  logo:{
    width: 100,
    height: 100,
    borderRadius: 20, 
  },
  jugadorItem: {
    padding: 5,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: 200
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
  button: {
    backgroundColor: 'teal',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    width: 300, // Adjust the width as needed
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,

  },
  
});

export default Bets;