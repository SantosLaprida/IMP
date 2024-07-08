import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Image } from 'react-native';
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
      colors={['#0d1825', '#2e4857']}
      style={styles.container}>
    <View style={styles.container}>
  <View style={styles.container2}>
  <Image
  source={require('../assets/images/logo-golf.png')}
  style={styles.logo}
/>
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
      placeholderTextColor="white"
    />
    </View>

        <View style={{...styles.btn, marginTop: 30}}>
          <Button color={"green"} onPress={handlePasswordReset} title="Send Email"  />
        </View>

        <View style={styles.btn}>
          <Button onPress={() => navigation.navigate('Login')}  title="Back"  />
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
  marginBottom: 30,
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
linkText: {
  color: 'white',
  marginTop: 10,
},
loginText: {
  fontWeight: 'bold',
  fontSize: 20,
  color: 'white',
  fontFamily: "Roboto",
},
});