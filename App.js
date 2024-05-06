import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image } from 'react-native';
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
    <View style={styles.container}>
    <View style={styles.container2}>
      <View >
        <Text  style={styles.text}>Welcome to the Internet Match Play</Text>
      </View>     
      <TextInput
        style={{...styles.input, marginTop: "3em"}}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View  style={{...styles.btn, marginTop: "2em"}}>
        <Button  title="Login" onPress={handleLogin} /> 
      </View>
      <View  style={styles.btn}> 
        <Button  color={"green"}  title="Register" onPress={() => navigation.navigate('Registro')} />
      </View>
      
      <StatusBar style="auto" />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    height: '100vh',
    width: '100vw',
    backgroundImage: 'url("./assets/fondo.jpg")',
    paddingBottom: 40,
    paddingTop: 40,
    backgroundSize: 'cover',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  container2: {
    borderRadius: '10px',
    width: '90%',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.788)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
   
  },
  text:{
    color: 'white',
    fontSize: '1.5rem',
    fontFamily: "Roboto",
    textAlign: 'center'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    width: '80%',
    color: "white",
    padding: 10,
    borderRadius: "10px",
    fontFamily: "Roboto",
  },
  loginText:{
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    fontFamily: "Roboto",
  },
  btn:{
    width: "80%",  
    marginTop: 10,
    backgroundColor: "black",
    borderRadius: "10px",
    fontFamily: "Roboto",
  }


});
