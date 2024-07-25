import { fetchTournament } from '../server/firestoreFunctions';

import React, { useEffect, useState, useRef} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';


const Tournaments = ({ navigation }) => {

  const BlinkDot = () => {
    const opacity = useRef(new Animated.Value(1)).current;
  
    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, [opacity]);
  
    return <Animated.View style={[styles.dot, { opacity }]} />;
  };
  
  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const [logo, setLogo] = useState(null)
  const [name, setName] = useState(null)
  
  const [modalVisible, setModalVisible] = useState(false);

  const handleGameMode = () => {
    setModalVisible(true);
  };

  const handleNavigate = (screen) => {
    setModalVisible(false);
    navigation.navigate(screen);
  };

  useEffect(() => {
    const getTournamentData = async () => {
      try{
        const torneo = await fetchTournament();
        
        let name = torneo[0].name;
        let start_date = torneo[0].start_date;
        let finish_date = torneo[0].finish_date;
        let logo = torneo[0].logo;

        setName(name)
        setStart(start_date)
        setEnd(finish_date)
        setLogo(logo)


      } catch (error) {
        console.error(error);
      }
    };

    getTournamentData();
    
  }, []);


  return (
    <LinearGradient
    colors={['#17628b34', 'white']}
    locations={[0, 15]}
    style={styles.container}
  >
    
      <View style={styles.box}>
      <Text style={{ ...styles.text, fontSize: 20, textDecorationLine: 'underline'}}>
        Tournament of the week
      </Text>
     
        <View style={styles.logoBox}> 
        <Text style={{ ...styles.text, paddingBottom: 5, fontSize: 15, marginTop: 0 }}>
          {name}
        </Text>
        <Image
          source={{ uri: logo }}
          style={styles.logo}
        />
        <View>
        <Text style={{ ...styles.text, fontSize: 10, marginTop: 5 }}>
          {"Starting date: " + start}
        </Text>
        <Text style={{...styles.text, fontSize: 10}}>
          {"Finish date: " + end}
        </Text>
        </View>
        </View>

        <TouchableOpacity 
          style={{ ...styles.btnClick, marginTop: 15}} 
          onPress={handleGameMode}
        >
          <Text style={styles.btnClickText}>Participate!</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.box}>
        <View style={styles.order}>
        <Text style={{ ...styles.text, paddingBottom: 5, fontSize: 18, textDecorationLine: 'underline' }}>Your Bets</Text>
    
        </View>
        <View style={{...styles.content, marginTop: 10}}>
          <TouchableOpacity style={styles.buttonContainer}>           
            <View style={styles.button} >
            <FontAwesome6 name="people-line" size={28} color="#1f3a5c" />
            </View>
            <Text style={styles.buttonText}>Traditional</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer}>           
            <View style={styles.button} >
            <FontAwesome name="random" size={28} color="#1f3a5c" />
            </View>
            <Text style={styles.buttonText}>Random</Text>
          </TouchableOpacity>
        </View>
   
        
        <TouchableOpacity 
          style={styles.btnClick} >
             <View style={styles.btnDot}>
          <Text style={styles.btnClickText}>Watch games live</Text>
          <BlinkDot />
          </View>
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select game mode</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleNavigate('Players')}>
              <Text style={styles.modalT}>Traditional</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonDisabled} onPress={() => handleNavigate('SemiFinals')}>
              <Text style={styles.modalTDisabled}>Random</Text>

            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles.modalButton, marginTop: 40, width: 250 }} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalT}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  box:{
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
    width: 350,
    marginTop: 30,
    backgroundColor: 'rgb(255, 252, 241)',
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 6, // Radio de la sombra
    // Para Android
    elevation: 10, // Elevación para la sombra
    
  },
  logo:{
    width: 150,
    height: 100,
    borderRadius: 10, 
    backgroundColor: "black",
    padding: 5,
  },
  logoBox:{
    backgroundColor: 'rgb(255, 252, 241)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    borderRadius: 10,
    borderWidth: 0,
    borderColor: '#17628b94',
    borderBottomWidth: 3, 
    borderBottomColor: 'rgba(0, 0, 0, 0.2)', 
    padding: 10,
    paddingHorizontal: 40,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  miniBox:{
    backgroundColor: 'rgb(255, 252, 241)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    borderRadius: 10,
    borderWidth: 0,
    borderColor: '#17628b94',
    borderBottomWidth: 5, 
    borderBottomColor: 'rgba(0, 0, 0, 0.2)', 
    paddingHorizontal: 30,
    padding: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: 'red',
    marginLeft: 5,
    marginRight: -5,
    marginTop: 2
  },
 
  container: {
    flex: 1,
    alignItems: 'center', 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.849)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'rgb(255, 252, 241)',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    color: '#1f3a5c',
    fontFamily: 'p-semibold',
  },
  modalButton: {
    backgroundColor: '#17628b34',
    padding: 7,
    margin: 5,
    borderRadius: 10,
    width: 200, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#17628b94',
    borderBottomWidth: 7, 
    borderBottomColor: 'rgba(0, 0, 0, 0.2)', 
  },
  modalT:{
    color: '#1f3a5c',
    fontSize: 17,
    fontFamily: 'p-semibold',
  },
  modalTDisabled:{
    color: 'white',
    fontFamily: 'p-semibold',
    fontSize: 15,
    textDecorationLine: "line-through"
  },
  modalButtonDisabled: {
    backgroundColor: "grey",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    width: 200,
    alignItems: 'center',
    borderColor: '#17628b94',
    borderBottomWidth: 7, 
    borderBottomColor: 'rgba(0, 0, 0, 0.2)', 
  },
  text: {
    fontSize: 15,
    color: '#1f3a5c',
    fontFamily: 'p-semibold',
  },
  btnClick: {
    backgroundColor: '#1f3a5c',
    padding: 6,
    margin: 5,
    borderRadius: 10,
    width: 300, 
    alignItems: 'center',
    borderWidth: 0,
    borderColor: '#17628b94',
    borderBottomWidth: 7, 
    borderBottomColor: 'rgba(0, 0, 0, 0.2)', 
  },
  btnClickText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'p-semibold',
    position: "relative",
    bottom: -2
  },
  betBtn:{  
    backgroundColor: '#1f3a5c',
    padding: 12,
    margin: 5,
    borderRadius: 10,
    width: 300, 
    borderColor: "#1f3a5c",
    borderWidth: 2, // Elevación para la sombra
    justifyContent: "center"
  },
  betText:{
    color: 'white',
    fontSize: 14,
    fontFamily: 'p-semibold',
    letterSpacing: 1.5,
    marginHorizontal: 25
  },
  editIcon: {
    position: "absolute",
    right: 0,
    marginHorizontal: 15,
  },
  order:{
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  btnDot:{
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    margin: 8,
    backgroundColor: 'rgb(255, 252, 241)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    borderRadius: 15,
    padding: 10
  },
  button: {
    backgroundColor: '#17628b34',
    padding: 10,
    margin: 5,
    marginHorizontal: 20,
    borderRadius: 50,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: '#17628b94',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)', 
  },
  buttonText: {
    color: '#1f3a5c',
    fontSize: 12,
    fontFamily: 'p-semibold',
  },
});

export default Tournaments;