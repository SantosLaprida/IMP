import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ImageBackground, Image, StatusBar } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const checkIfUserExists = async (email, password) => {
    try {
      const response = await fetch(`http://localhost:3000/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      console.log('Response status:', response.status);

      const data = await response.json();
  
      console.log('Response data:', data);

      if(data.message === 'Login successful') {
        //alert('Login successful');
        navigation.navigate('Home');
        return true;
      } else {
        alert('Login failed');
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
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
  
    const loginSuccessful = await checkIfUserExists(email, password);
    console.log(`Login successful: ${loginSuccessful}`);

  };

  return (


    <ImageBackground source={require('./assets/fondo.jpg')} style={styles.container}>
      <View style={styles.container}>
    <View style={styles.container2}>
    <Image
    source={require('./assets/logo.png')}
    style={styles.logo}
  />
      <View >
        <Text  style={styles.text}>Welcome to the Internet Match Play</Text>
      </View>     
      <TextInput
        style={{...styles.input, marginTop: "3em"}}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="white"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="white"
      />
      <View  style={{...styles.btn, marginTop: 30}}>
        <Button  title="Login" onPress={handleLogin} /> 
      </View>
      <View   style={styles.btn}> 
        <Button  color={"green"}  title="Register" onPress={() => navigation.navigate('Registro')} />
      </View>
      <StatusBar style="auto" />
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
        size: 100,
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
      btn:{
        width: 250,  
        marginTop: 15,
        backgroundColor: "black",
        borderRadius: 15, // Changed from "10px" to 10
        fontFamily: "Roboto",
      },
      loginText:{
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        fontFamily: "Roboto",
      },

});