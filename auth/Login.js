import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { loginUserAPI } from '../api';

//import { checkIfUserExistsAPI } from '../api';
// import { checkIfUserExists } from '../api';
//import { localStorage } from './Storage'; 

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };


  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };


  const handleLogin = async () => {

    console.log(`Email: ${email}, Password: ${password}`);
  
    if(!email || !password) {
      alert('All fields are required');
      return;
    }
  
    if (!validateEmail(email)) {
      alert('Invalid email format');
      return;
    }
  
    try {
      const userData = await loginUserAPI(email.toLowerCase(), password);
      if (userData) {
        await AsyncStorage.setItem('user', JSON.stringify({ uid: userData.uid, email: userData.email }));
        console.log('Login successful');
        navigation.navigate('Main');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed');
    }
  };


  return (

     
    <LinearGradient
    colors={['#1f3a5c', 'white']}
    locations={[0, 0.5]}
    style={styles.container}>

<Image
    source={require('../assets/images/IMP-02.png')}
    style={styles.logo}
  /> 
    <View style={styles.container2}>
 
    <View >
        <Text  style={styles.text}>Welcome!</Text>
      </View>   

      <View style={styles.passwordContainer}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#28486e6b"
      />
      </View>
    <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
              placeholderTextColor="#28486e6b"
            />
            <TouchableOpacity onPress={toggleSecureTextEntry} style={styles.icon}>
              <Icon name={secureTextEntry ? 'eye-off' : 'eye'} size={24} color="#1f3a5c" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{...styles.button, marginTop: 30}} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>  
          <TouchableOpacity onPress={() => navigation.navigate('PasswordReset')}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
          <StatusBar style="auto" />
        </View>
      </LinearGradient>

   
   
    
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 250,
    height: 150,
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  container2: {
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    padding: 20,
    height: "52%", 
    backgroundColor: 'rgb(255, 252, 241)',
    marginTop: 0,
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 6, // Radio de la sombra
    // Para Android
    elevation: 10, // Elevación para la sombra
    
  },
  text: {
    color: '#1f3a5c',
    fontSize: 20,
  
    padding: 10,
    marginBottom: 10,
    fontWeight: "700"
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#1f3a5c',
    borderWidth: 1.5,
    borderRadius: 10,
    width: 300,
    marginTop: 10,
  },
  input: {
    flex: 1,
    color: '#1f3a5c',
    fontWeight: "500",
    padding: 10,
    fontSize: 16,
  },
  icon: {
    padding: 10,
  },
  button: {
    backgroundColor: '#17628b34',
    padding: 6,
    margin: 5,
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
    fontSize: 17,
    fontWeight: "500"
  },
  linkText: {
    color: '#1f3a5c',
    marginTop: 10,
    fontWeight: "500",
    fontSize: 12,
  },
});