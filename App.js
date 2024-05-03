import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    
    console.log(`Username: ${username}, Password: ${password}`);
  };

  const handleRegister = () => {
    
    
  };

  return (
    <SafeAreaProvider>
        <View style={styles.container}>
          <View>
            <Text>Welcome to the Internet Match Play</Text>
          </View>
          
          <Text style={styles.loginText}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={{marginTop:10}}>
            <Button title="Login" onPress={handleLogin} color="#841584"/> 
          </View>
          <View style={{marginTop:10}}> 
            <Button title="Register" onPress={() => console.log('Register')} color="#841584"/>
          </View>
          
          
          <StatusBar style="auto" />
        </View>
      </SafeAreaProvider>
    
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

  loginText:{
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',

  }



});


// npm start