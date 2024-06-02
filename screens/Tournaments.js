import React, { useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Tournaments = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser !== null) {
        setUser(JSON.parse(storedUser));
      }
    };
  
    loadUser();
  }, []);

  return (
    <ImageBackground source={require('../assets/fondo.jpg')} style={styles.container}>
      
      <View style={styles.box}>
        <Text style={{...styles.text, paddingBottom: 20, fontSize: 20}}>Upcoming Tournament</Text>
      <Image
    source={require('../assets/Golf-PGA.webp')}
    style={styles.logo}
  />
  <Text style={{...styles.text, marginTop: 20}}>Starting date: 16/05/24</Text>
  <Text style={styles.text}>Ending date: 19/05/24</Text>
  <TouchableOpacity style={{...styles.button, width: 250, marginTop: 30, padding: 10}} onPress={() => navigation.navigate('Players')}>
          <Text style={styles.buttonText}>Participate</Text>
        </TouchableOpacity>
  </View>
  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('')}>
          <Text style={styles.buttonText}>ICP Calendar 2024</Text>
        </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.788)'
  },
  logo:{
    width: 200,
    height: 200,
    borderRadius: 20, 
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
    fontWeight: "800",
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

export default Tournaments;