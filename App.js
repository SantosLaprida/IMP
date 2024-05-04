import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Registro from './Registro'; // Importa el componente Registro desde registro.js

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
      <View>
        <Text>Welcome to the Internet Match Play</Text>
      </View>
      
     
      <TextInput
        style={styles.input}
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
      <View style={{marginTop:10}}>
        <Button title="Login" onPress={handleLogin} color="#841584"/> 
      </View>
      <View style={{marginTop:10}}> 
        <Button title="Register" onPress={() => navigation.navigate('Registro')} color="#841584"/>
      </View>
      
      <StatusBar style="auto" />
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
  loginText:{
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
  }
});
