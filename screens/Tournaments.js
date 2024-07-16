
import React, { useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';


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
    <LinearGradient
    colors={['#0d1825', '#2e4857']}
    style={styles.container}>
      
      <View style={styles.box}>
        <Text style={{...styles.text, paddingBottom: 20, fontSize: 20}}>Tournament of the week</Text>
      <Image
    source={require('../assets/images/Golf-PGA.webp')}
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