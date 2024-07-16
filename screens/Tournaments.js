import { fetchTournament } from '../server/firestoreFunctions';

import React, { useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';


const Tournaments = ({ navigation }) => {
  
  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const [logo, setLogo] = useState(null)
  const [name, setName] = useState(null)
  

  useEffect(() => {
    const getTournamentData = async () => {
      try{
        const torneo = await fetchTournament();
        
        let name = torneo[0].name;
        let start_date = torneo[0].start_date;
        let finish_date = torneo[0].finish_date;
        let logo = torneo[0].logo;

        setName(name)
        setStart(start_date)
        setEnd(finish_date)
        setLogo(logo)


      } catch (error) {
        console.error(error);
      }
    };

    getTournamentData();
    
  }, []);


  return (
    <LinearGradient
    colors={['#0d1825', '#2e4857']}
    style={styles.container}>
      
      <View style={styles.box}>
        <Text style={{...styles.text, paddingBottom: 20, fontSize: 20}}>{name}</Text>
        <Image
        source={{ uri: logo }}
        style={styles.logo}
      />
  <Text style={{...styles.text, marginTop: 20}}>{start}</Text>
  <Text style={styles.text}>{end}</Text>
  <TouchableOpacity style={{...styles.button, width: 250, marginTop: 30, padding: 10}} onPress={() => navigation.navigate('Players')}>
          <Text style={styles.buttonText}>Participate</Text>
        </TouchableOpacity>
  </View>
  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('')}>
          <Text style={styles.buttonText}>ICP Calendar 2024</Text>
        </TouchableOpacity>
        </LinearGradient>
  );
};



const styles = StyleSheet.create({
  box:{
    marginBottom: 50,
    padding: 50,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  logo:{
    width: 200,
    height: 200,
    borderRadius: 20, 
    backgroundColor: "white",
    padding: 5,
  },
 
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: "center"
    
  },
  text: {
    fontSize: 15,
    textAlign: "left",
    fontWeight: "800",
    color: "white",
    fontFamily: 'Roboto' 
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

export default Tournaments;