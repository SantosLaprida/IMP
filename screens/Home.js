import React, { useEffect, useState} from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles from "../styles/styles"

const Home = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser !== null) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);


  return (
    <LinearGradient
    colors={['#0d1825', '#2e4857']}
    style={globalStyles.container}>
    <View style={globalStyles.row}>
  
    <Image
    source={require('../assets/images/logo-golf.png')}
    style={globalStyles.logo}
  />
        <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate('Tournaments')}>
          <Text style={globalStyles.buttonText}>Tournaments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate('Bets')}>
          <Text style={globalStyles.buttonText}>Bets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate('Wallet')}>
          <Text style={globalStyles.buttonText}>Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate('Settings')}>
          <Text style={globalStyles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
   </LinearGradient>
  );
};


export default Home;