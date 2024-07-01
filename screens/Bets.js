import { fetchPlayers, retrieveTeam, storeTeam, get_name_by_id, fetchTeamAPI } from '../api';
import { getPlayerName } from '../server/firestoreFunctions';

import { auth } from '../server/firebaseConfig';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image, Button, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Bets = ({ navigation }) => {
  const [finalTeam, setFinalTeam] = useState([]);

  useEffect(() => {

    const getTeam = async () => {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const teamData = await fetchTeamAPI(userId);
        const playerNamesPromises = teamData.map(player => getPlayerName(player.id_player));
        const playerNames = await Promise.all(playerNamesPromises);
        setFinalTeam(playerNames);
      }
    };

    getTeam();

  }, []);

  return (
    <LinearGradient
    colors={['#0d1825', '#2e4857']}
    style={styles.container}>
    <View style={styles.box}>
      <Text style={{ ...styles.text, paddingBottom: 20, fontSize: 20 }}>Your bet</Text>
      <Image
    source={require('../assets/images/Golf-PGA.webp')}
    style={styles.logo}
  />
    <TouchableOpacity style={{...styles.button, width: 200, padding: 5, marginTop: 20, marginBottom: 20}} onPress={() => navigation.navigate('QuarterFinals')}>
          <Text style={{...styles.buttonText, fontSize: 15}}>See games live</Text>
        </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false}>
      {finalTeam.length > 0 ? (
        finalTeam.map((name, index) => (
          <View key={index} style={styles.jugadorItem}>
          <Text>{name}</Text>
        </View>
        ))
      ) : (
        <Text style={styles.text}>No players selected yet.</Text>
      )}
      </ScrollView>
      </View>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Players')}>
        <Text style={styles.buttonText}>
          {finalTeam.length > 0 ? 'Edit my team' : 'Select players'}
        </Text>
</TouchableOpacity>
</LinearGradient>
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
    backgroundColor: 'rgba(226, 202, 64, 0.438)',
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