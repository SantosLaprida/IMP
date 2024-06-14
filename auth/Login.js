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
        colors={['#0d1825', '#2e4857']}
        style={styles.container}>
      <View style={styles.container}>
    <View style={styles.container2}>
    <Image
    source={require('../assets/images/logo-golf.png')}
    style={styles.logo}
  />
      <View >
        <Text  style={styles.text}>Welcome to the Internet Match Play</Text>
      </View>     
      <View style={styles.passwordContainer}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="white"
      />
      </View>
    <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
              placeholderTextColor="white"
            />
            <TouchableOpacity onPress={toggleSecureTextEntry} style={styles.icon}>
              <Icon name={secureTextEntry ? 'eye-off' : 'eye'} size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={{ ...styles.btn, marginTop: 30 }}>
            <Button color={""} title="Login" onPress={handleLogin} />
          </View>
          <View style={styles.btn}>
            <Button color={"green"} title="Create account" onPress={() => navigation.navigate('Register')} />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('PasswordReset')}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
          <StatusBar style="auto" />
        </View>
      </View>
    </LinearGradient>
   
   
    
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 300,
    height: 150,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    borderRadius: 25,
    width: '90%',
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    color: 'white',
    fontSize: 25,
    fontFamily: "Roboto",
    textAlign: 'center',
    padding: 10,
    marginBottom: 30,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    width: 300,
    marginTop: 10,
  },
  input: {
    flex: 1,
    color: 'white',
    padding: 10,
    fontSize: 16,
  },
  icon: {
    padding: 10,
  },
  btn: {
    width: 300,
    marginTop: 15,
    height: 45,
    backgroundColor: "black",
    borderRadius: 15,
    fontFamily: "Roboto",
  },
  linkText: {
    color: 'white',
    marginTop: 10,
  },
  loginText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    fontFamily: "Roboto",
  },
});