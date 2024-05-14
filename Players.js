import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image, Button, useAnimatedValue } from 'react-native';


const getPlayers = async () => {
  const response = await fetch('http://localhost:3000/players');
  const data = await response.json();
  return data;

};

const Players = () => {
  const [players, setPlayers] = React.useState([]);

  React.useEffect(() => {
    getPlayers().then(data => setPlayers(data));
  }, []);



  const jugadores = players;

  
  return (
    <ImageBackground source={require('./assets/fondo.jpg')} style={styles.container}>
      <View style={styles.box}>
      <Text style={{...styles.text, paddingBottom: 20, fontSize: 20}}>Players</Text>
        <ScrollView>
       
        {jugadores.map(jugador => (
          <View key={jugador.id} style={styles.jugadorItem}>
            <Text>{jugador.nombre}</Text>
          </View>
        ))}
      </ScrollView>
  </View>
  <View  style={styles.btn}>
        <Button  title="Choose your players!"  /> 
      </View>
   </ImageBackground>
  );
};

const styles = StyleSheet.create({
  box:{
    marginBottom: 50,
    borderWidth: 5, // ancho del borde
    borderColor: 'teal',
    padding: 50,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.788)',
    height: 500,
    
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