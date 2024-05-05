

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function Registro() {
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
    <View style={styles.container}>
      <View>
        <Text>Welcome to the Internet Match Play</Text>
      </View>

      <Text style={styles.loginText}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
    
      <View style={{ marginTop: 10 }}>
        <Button title="Registrarse" onPress={handleRegister} color="#841584" />
      </View>

    </View>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ADD8E6', // Light blue
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    width: '80%',
    padding: 10,
  },
  loginText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
  }
});
