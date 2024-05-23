

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, Image } from 'react-native';

export default function Register({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');


  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const checkIfEmailExists = async (email) => {
    try {
      const response = await fetch(`http://localhost:3000/users/email/${email}`);
      const data = await response.text();
      return data === 'Email is taken';
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const handleRegister = async () => {
    console.log(`Email: ${email}, Password: ${password}, First Name: ${firstName}, Last Name: ${lastName}`);
    
    if(!email || !password || !firstName || !lastName) {
      alert('All fields are required');
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

    const emailExists = await checkIfEmailExists(email);

  if (emailExists) {
    // The email is taken. Show an error message or do something else.
    alert('The email is taken.');
  } else {
    // The email is available. Proceed with the registration process.
    //console.log('The email is available. Proceeding with registration...');

    const user = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    };

    // Send a POST request to the server to register the user.
    fetch('http://localhost:3000/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'User registered successfully') {

      // ########################################################################
      // CAR: ACA INSERTA EL CODIGO PARA QUE TE MANDE A UNA NUEVA PAGINA Y 
      // TAMBIEN QUE TE MUESTRE UN MENSAJE DE QUE TE REGISTRASTE CORRECTAMENTE O ALGO POR EL ESTILO
      // ########################################################################
      
      //navigate to login page
      navigation.navigate('Login');
      

      console.log('User registered successfully');
    } else {
      
      console.error('Error:', data.error);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });


    }

  }


  return (

    <ImageBackground source={require('../assets/fondo.jpg')} style={styles.container}>
  <View>  
    <Button title="Back" onPress={() => navigation.navigate('Login')}/>
  </View>

  <View style={styles.container}>
    <View style={styles.container2}>
      <Image source={require('../assets/logo.png')} style={styles.logo}/>
      <View>
        <Text style={styles.text}>Welcome to the Internet Match Play</Text>
      </View>
      <TextInput
        style={{...styles.input, marginTop: "3em"}}
        placeholder="Name"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor="white"
      />
      <TextInput
        style={styles.input}
        placeholder="Lastname"
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor="white"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="white"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="gray"
        autoCompleteType="off"
      />
      <TextInput
        style={styles.input}
        placeholder="Repeat password"       
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="gray"
        autoCompleteType="off"
      />

      <View style={{...styles.btn, marginTop: 30}}>
        <Button title="Register" onPress={handleRegister} color={"green"} />
      </View>
    </View>
  </View>
</ImageBackground>
  );

}
const styles = StyleSheet.create({
  logo:{
    width: 100,
    height: 100,
    borderRadius: 20,   
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
    paddingTop: 40,
  },
  container2: {
    borderRadius: 25,
    width: '90%',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.788)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    paddingTop: 0,
    
  },
  text:{
    color: 'white',
    fontSize: 20, // Changed from '1.5rem' to 20
    fontFamily: "Roboto",
    textAlign: 'center',
    padding: 40,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: 250,
    marginTop: 10,
    color: "white",
    padding: 10,
    borderRadius: 10, // Changed from "10px" to 10
    fontFamily: "Roboto",
  },
  loginText:{
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    fontFamily: "Roboto",
  },
  btn:{
    width: 250,  
    marginTop: 15,
    backgroundColor: "black",
    borderRadius: 15, // Changed from "10px" to 10
    fontFamily: "Roboto",
  }
});