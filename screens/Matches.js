import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, Button, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Matches = ({ navigation }) => {
  return (
    <LinearGradient
    colors={['#0d1825', '#2e4857']}
    style={styles.container}>  

<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Bets')}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

      <View style={{...styles.box, marginTop: 15}}>
        <View style={styles.player}>
            <Text style={{...styles.text, marginBottom: 10}}>Player 1</Text>
            <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
            />
             <Text style={{...styles.text, marginTop: 5}}>3up</Text>
        </View>
        <View style={styles.player}>
            <Text style={styles.text}>VS</Text>
        
        </View>
        <View style={styles.player}>
            <Text style={{...styles.text, marginBottom: 10}}>Player 1</Text>
            <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
            />
             <Text style={{...styles.text, marginTop: 5}}>3d</Text>
        </View>
       
      </View>
      <View style={styles.box}>
       
       </View>
       <View style={styles.box}>
       
       </View>
       <View style={styles.box}>
       
       </View>
       </LinearGradient>
  );    
};



const styles = StyleSheet.create({
  box:{
    marginBottom: 15,
    flex: 1,
    flexDirection: "row",
    borderWidth: 5, // ancho del borde
    borderColor: 'teal',
    padding: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    alignItems: 'center',
    width: 350,
    backgroundColor: 'rgba(0, 0, 0, 0.788)'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
    justifyContent: "center"
  },
  text:{
    color: "white",
    textAlign: "center",
    fontWeight: "800"
  },
  logo:{
    width: 80,
    height: 80,
    borderRadius: 20,   
  },
  player:{
    marginHorizontal: 14
  },
  button: {
    backgroundColor: 'rgba(226, 202, 64, 0.438)',
    padding: 6,
    borderRadius: 10,
    width: 350, // Adjust the width as needed
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});

export default Matches;