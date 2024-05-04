// registro.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleRegister = () => {
    console.log(`Email: ${email}, Password: ${password}, First Name: ${firstName}, Last Name: ${lastName}`);
    // Aquí puedes agregar la lógica para registrar al usuario
  };

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
