import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { sendPasswordResetAPI } from '../api';
import { LinearGradient } from 'expo-linear-gradient';


export default function PasswordReset({ navigation }) {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    try {
      await sendPasswordResetAPI(email.toLowerCase());
      Alert.alert('Success', 'Password reset email sent!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to send password reset email. Please try again.');
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

    <View >
      <Text  style={styles.text}>Reset your password</Text>
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


        <TouchableOpacity style={{...styles.button, marginTop: 20}} onPress={handlePasswordReset}>
          <Text style={styles.buttonText}>Send Email</Text>
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
    width: '90%',
    alignItems: 'center',
    padding: 20,
    height: 350,
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
  
    padding: 20,
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