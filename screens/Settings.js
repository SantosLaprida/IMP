import React, { useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
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
    <ImageBackground source={require('../assets/images/fondo.jpg')} style={styles.container}>
    <View style={styles.row}>
    <Text style={styles.text}>Settings</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>About us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} >
          <Text style={styles.buttonText}>Rules of play</Text>
        </TouchableOpacity>
      </View>
   </ImageBackground>
  );
};



const styles = StyleSheet.create({
  row:{
    backgroundColor: "rgba(0, 0, 0, 0.788)",
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
    backgroundColor: 'black',
    justifyContent: "center"
    
  },
  button: {
    backgroundColor: 'teal',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    width: 300, // Adjust the width as needed
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  logo:{
    width: 100,
    height: 100,
    borderRadius: 20,   
    marginBottom: 30
  },
});


export default Settings;