import React, { useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

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
    colors={['#0d1825', '#2e4857']}
    style={styles.container}>
    <View style={styles.row}>
  
    <Image
    source={require('../assets/images/logo-golf.png')}
    style={styles.logo}
  />
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Tournaments')}>
          <Text style={styles.buttonText}>Tournaments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Bets')}>
          <Text style={styles.buttonText}>Bets</Text>
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
    backgroundColor: "transparent",
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
    backgroundColor: 'transparent',
    justifyContent: "center"
    
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
  logo: {
    width: 300,
    height: 150,
    marginBottom: 30,
  },
});


export default Home;