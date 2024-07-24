import { registerUserAPI } from '../api';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';

export default function Register({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const toggleConfirmSecureTextEntry = () => {
    setConfirmSecureTextEntry(!confirmSecureTextEntry);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    console.log(`Email: ${email}, Password: ${password}, First Name: ${firstName}, Last Name: ${lastName}`);
    
    if(!email || !password || !firstName || !lastName) {
      alert('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!validateEmail(email)) {
      alert('Invalid email format');
      return;
    }

    if(password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      const user = await registerUserAPI(email.toLowerCase(), password, firstName, lastName);
      if (user) {
        alert('Registration successful');
        navigation.navigate('Login');
      }
    } catch (error) {
      alert('Registration failed');
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
  
      <View>
        <Text style={styles.text}>Create account</Text>
      </View>
      <View style={styles.passwordContainer}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor="#28486e6b"
      />
      </View>
       <View style={styles.passwordContainer}>
      <TextInput
        style={styles.input}
        placeholder="Lastname"
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor="#28486e6b"
      />
      </View>
        <View style={styles.passwordContainer}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
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
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={confirmSecureTextEntry}
              placeholderTextColor="#28486e6b"
            />
            <TouchableOpacity onPress={toggleConfirmSecureTextEntry} style={styles.icon}>
              <Icon name={confirmSecureTextEntry ? 'eye-off' : 'eye'} size={24} color="#1f3a5c" />
            </TouchableOpacity>
          </View>
      <TouchableOpacity style={{...styles.button, marginTop: 20}} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
    </View>
</LinearGradient>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 250,
    height: 150,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(241, 228, 151)',
  },
  container2: {
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
    height: "68%",
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
    fontWeight: "500"
  },
  loginText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    fontFamily: "Roboto",
  },
});