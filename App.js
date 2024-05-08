import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, 
      Text, View, TextInput, Button, ImageBackground, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Registro from './Register'; // Importa el componente Registro desde registro.js

const Stack = createStackNavigator();

export default function App() {


  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Registro" component={Registro} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log(`Email: ${username}, Password: ${password}`);
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
