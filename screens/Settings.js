import React, { useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Settings = ({ navigation }) => {
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
      {user && <Text style={styles.userText}>Welcome, {user.name} {user.last_name} {user.id_member}</Text>}
      <View  style={{...styles.btn, marginBottom: 30}}>
        <Button  title="See bracket" onPress={() => navigation.navigate('Matches')} /> 
      </View>
      <View style={styles.box}>
        <Text style={{...styles.text, paddingBottom: 20, fontSize: 20}}>Upcoming Tournament</Text>
      <Image
    source={require('../assets/Golf-PGA.webp')}
    style={styles.logo}
  />
  <Text style={{...styles.text, marginTop: 20}}>Starting date: 16/05/24</Text>
  <Text style={styles.text}>Ending date: 19/05/24</Text>
  </View>
  <View  style={styles.btn}>
        <Button  title="Participate" onPress={() => navigation.navigate('Players')} /> 
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
    backgroundColor: 'rgba(0, 0, 0, 0.788)'
  },
  logo:{
    width: 200,
    height: 200,
    borderRadius: 20, 
  },
  userText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
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

export default Settings;