import { fetchPlayers } from './api';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image, Button, TouchableOpacity, TextInput } from 'react-native';

const Players = () => {

  const [equipo, setEquipo] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getPlayers = async () => {
      const data = await fetchPlayers();
      console.log(data);
      setJugadores(data);
      console.log(data);
    };

    getPlayers();
  }, []);


  // const jugadores = [
  //   { id: 1, nombre: 'Jugador 1' },
  //   { id: 2, nombre: 'Jugador 2' },
  //   { id: 3, nombre: 'Jugador 3' },
  //   { id: 4, nombre: 'Jugador 4' },
  //   { id: 5, nombre: 'Jugador 5' },
  //   { id: 6, nombre: 'Jugador 6' },
  //   { id: 7, nombre: 'Jugador 7' },
  //   { id: 8, nombre: 'Jugador 8' },
  //   { id: 9, nombre: 'Jugador 9' },
  //   { id: 10, nombre: 'Jugador 10' },
  //   { id: 11, nombre: 'Jugador 11' },
  //   { id: 12, nombre: 'Jugador 12' },
  //   { id: 13, nombre: 'Jugador 13' },
    
    // ACA IRIA LA LOGICA PARA TRAER LOS JUGADORES DE LA BASE DE DATOS
  //];

  const agregarJugadorAlEquipo = (jugador) => {
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

  const filteredJugadores = jugadores.filter((jugador) =>
    jugador.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ImageBackground source={require('./assets/fondo.jpg')} style={styles.container}>
      <View style={styles.box}>
      <Text style={{ ...styles.text, paddingBottom: 20, fontSize: 20 }}>Players</Text>
      <TextInput
        style={{ height: 40, width: '100%', borderColor: 'gray', borderWidth: 1, marginBottom: 20, color: 'white'}}
        onChangeText={text => setSearchTerm(text)}
        value={searchTerm}
        placeholder="Search players"
        placeholderTextColor="white"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredJugadores.map((jugador) => (
          <TouchableOpacity key={jugador.id_player} onPress={() => agregarJugadorAlEquipo(jugador)}>
            <View style={styles.jugadorItem}>
              <Text>{jugador.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
    <View style={styles.box}>
      <Text style={{ ...styles.text, paddingBottom: 20, fontSize: 20 }}>Your team</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {equipo.map((jugador) => (
          <TouchableOpacity key={jugador.id_player} onPress={() => quitarJugadorDelEquipo(jugador)}>
            <View style={styles.jugadorItem}>
              <Text>{jugador.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </View>
    <View style={styles.btn}>
      <Button title="Choose your players!" />
    </View>
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
    height: 300,
    marginBottom: 25,
    
  },
  logo:{
    width: 200,
    height: 200,
    borderRadius: 20, 
  },
  jugadorItem: {
    padding: 10,
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
  btn:{
    width: 300,  
    borderRadius: 20, // Changed from "10px" to 10
    fontFamily: "Roboto",
  },
  
});

export default Players;