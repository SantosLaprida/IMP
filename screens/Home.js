import React, { useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const Home = ({ navigation }) => {

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
    <LinearGradient
    colors={['#1f3a5c', 'white']}
    locations={[0, 0.5]}
    style={styles.container}>
        
    <Image
    source={require('../assets/images/IMP-02.png')}
    style={styles.logo}
  />
    <View style={styles.row}>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Tournaments')}>
          <Text style={styles.buttonText}>Tournaments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Bets')}>
          <Text style={styles.buttonText}>Games</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Wallet')}>
          <Text style={styles.buttonText}>Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
   </LinearGradient>
  );
};



const styles = StyleSheet.create({
  row:{
    backgroundColor: 'rgb(255, 252, 241)',
    marginTop: 0,
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 6, // Radio de la sombra
    // Para Android
    elevation: 10, // Elevación para la sombra
    padding: 20,
    paddingVertical: 40,
    borderRadius: 25,
    paddingTop: 60,
    alignItems: "center",
  },
  text: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "700",
    color: "white",
    paddingBottom: 20
  },
 
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: "center"
    
  },
  button: {
    backgroundColor: '#17628b34',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    width: 300, 
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
  logo: {
    width: 250,
    height: 150,
    marginBottom: 30,
  },
});


export default Home;
