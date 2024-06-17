import { fetchPlayers, storeTeam } from '../api';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image, Button, TouchableOpacity, TextInput } from 'react-native';

const Players = ({navigation}) => {

  const [equipo, setEquipo] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [originalJugadores, setOriginalJugadores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getPlayers = async () => {
      const data = await fetchPlayers();
      setJugadores(data);
      setOriginalJugadores(data);
    };

    getPlayers();
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

    const nuevoEquipo = equipo.filter((j) => j.id_player !== jugador.id_player);
    setEquipo(nuevoEquipo);
    setJugadores((prevJugadores) => [...prevJugadores, jugador]);
    
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
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
      await storeTeam( userId, playersIds );
      console.log('Team stored successfully');
    } catch (error) {
      console.error('Failed to store team:', error);
    }

    await AsyncStorage.setItem('equipo', JSON.stringify(equipo));

    setEquipo([]);
    setJugadores(originalJugadores);
  }

  const filteredJugadores = jugadores.filter((jugador) =>
    jugador.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jugador.ranking.toString().includes(searchTerm)
  );

  return (
    <ImageBackground source={require('../assets/images/fondo.jpg')} style={styles.container}>

<TouchableOpacity style={{...styles.button, marginBottom: 10, backgroundColor: "green"}} onPress={() => navigation.navigate('Tournaments')}>
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
            <View style={{...styles.jugadorItem, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>{jugador.name}</Text>
            <Text>{jugador.ranking}</Text>
          </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
    <View style={{...styles.box, height: 250}}>
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
  </ImageBackground>
  );
};

const styles = StyleSheet.create({
  box:{
    borderWidth: 5, // ancho del borde
    borderColor: 'teal',
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.788)',
    height: 400,
    marginBottom: 25, 
  },
  itemTitle:{
    borderRadius: 5,
    width: 250,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginVertical: 10
  },
  logo:{
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
  btn:{
    width: 300,  
    borderRadius: 20, // Changed from "10px" to 10
    fontFamily: "Roboto",
  },
  scroll:{
    width: 250,
   
  },
  input:{
    width: 250, 
    borderColor: 'white', 
    borderWidth: 1, 
    padding: 5,
    color: 'white',
    borderRadius: 5,
    height: 30
  },
  button: {
    backgroundColor: 'teal',
    padding: 8,
    borderRadius: 10,
    width: 350, // Adjust the width as needed
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  
});

export default Players;