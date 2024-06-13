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
      const user = await registerUserAPI(email.toLowerCase(), password);
      if (user) {
        alert('Registration successful');
        navigation.navigate('Login');
      }
    } catch (error) {
      alert(`Registration failed: ${error.message}`);
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
      <View>
        <Text style={styles.text}>Welcome to the Internet Match Play</Text>
      </View>
      <View style={styles.passwordContainer}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor="white"
      />
      </View>
       <View style={styles.passwordContainer}>
      <TextInput
        style={styles.input}
        placeholder="Lastname"
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor="white"
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
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={confirmSecureTextEntry}
              placeholderTextColor="white"
            />
            <TouchableOpacity onPress={toggleConfirmSecureTextEntry} style={styles.icon}>
              <Icon name={confirmSecureTextEntry ? 'eye-off' : 'eye'} size={24} color="white" />
            </TouchableOpacity>
          </View>

      <View style={{...styles.btn, marginTop: 30}}>
        <Button title="Register" onPress={handleRegister} color={"green"} />
      </View>
      <View style={styles.btn}>
            <Button color={""} title="Back" onPress={() => navigation.navigate('Login')} />
          </View>
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
    marginBottom: 20
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
  loginText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    fontFamily: "Roboto",
  },
}); 