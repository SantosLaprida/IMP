import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView  } from 'react-native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const Home = ({ navigation }) => {

  const [fontsLoaded] = useFonts({
    'kanitBold': require('../assets/fonts/kanit/Kanit-Bold.ttf'),
  });
  if (!fontsLoaded) {
    return <AppLoading/>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.dashboard, styles.customFont]}>
          IMP <FontAwesome5 name="golf-ball" size={18} color="#2296F3" />
        </Text>
        <View style={styles.iconRow}>
          <FontAwesome name="bell" size={25} marginHorizontal={25} color="#2296F3" />
          <Ionicons name="settings" size={25} color="#2296F3" />
        </View>
      </View>

      <View style={styles.walletCont}>
        <Text style={[styles.wallet, styles.customFont]}>
          My Wallet
        </Text>
        <Text style={[styles.customFont]}>
          <Entypo name="wallet" size={130} color="black" />
        </Text>
        <Text style={[styles.customFont]}>
          Available Balance
        </Text>
        <Text style={[styles.customFont]}>
          $50.2
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.containerGrid}>
      <Text style={[styles.title, styles.customFont]}>
          Recent Bets
        </Text>
        <View style={styles.rowGrid}>
        <Ionicons name="golf" size={12}  marginHorizontal={4} color="#2296F3" />
          <Text style={[styles.tournament, styles.customFont]}>Tournament</Text>
          <Text style={[styles.date, styles.customFont]}>Date</Text>
          <Text style={[styles.pl, styles.customFont]}>P/L</Text>
          <AntDesign name="pluscircle" size={18} style={styles.seeMore} color="black" />
        </View>
        
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.containerGridData}>
        <View style={styles.rowGridData}>
        <Ionicons name="golf" size={12}  marginHorizontal={4} color="black" />
          <Text style={[styles.tournamentData, styles.customFont]}>PGA Tour</Text>
          <Text style={[styles.dateData, styles.customFont]}>12/04/24</Text>
          <Text style={[styles.plData, styles.customFont, { color: 'red'}]}>-$10</Text>
          <AntDesign name="pluscircle" size={18} style={styles.seeMore} color="black" />
        </View>
        <View style={styles.rowGridData}>
        <Ionicons name="golf" size={12}  marginHorizontal={4} color="black" />
          <Text style={[styles.tournamentData, styles.customFont]}>Open Championship</Text>
          <Text style={[styles.dateData, styles.customFont]}>12/04/24</Text>
          <Text style={[styles.plData, styles.customFont, { color: 'red'}]}>-$10</Text>
          <AntDesign name="pluscircle" size={18} style={styles.seeMore} color="black" />
        </View>    
        <View style={styles.rowGridData}>
        <Ionicons name="golf" size={12}  marginHorizontal={4} color="black" />
          <Text style={[styles.tournamentData, styles.customFont]}>Us Open</Text>
          <Text style={[styles.dateData, styles.customFont]}>12/04/24</Text>
          <Text style={[styles.plData, styles.customFont, { color: 'red'}]}>-$10</Text>
          <AntDesign name="pluscircle" size={18} style={styles.seeMore} color="black" />
        </View>    
        <View style={styles.rowGridData}>
        <Ionicons name="golf" size={12}  marginHorizontal={4} color="black" />
          <Text style={[styles.tournamentData, styles.customFont]}>British Open</Text>
          <Text style={[styles.dateData, styles.customFont]}>12/04/24</Text>
          <Text style={[styles.plData, styles.customFont, { color: 'green'}]}>+$1450</Text>
          <AntDesign name="pluscircle" size={18} style={styles.seeMore} color="black" />
        </View>     
        <View style={styles.rowGridData}>
        <Ionicons name="golf" size={12}  marginHorizontal={4} color="black" />
          <Text style={[styles.tournamentData, styles.customFont]}>Canada</Text>
          <Text style={[styles.dateData, styles.customFont]}>12/04/24</Text>
          <Text style={[styles.plData, styles.customFont, { color: 'red'}]}>-$10</Text>
          <AntDesign name="pluscircle" size={18} style={styles.seeMore} color="black" />
        </View>
        <View style={styles.rowGridData}>
        <Ionicons name="golf" size={12}  marginHorizontal={4} color="black" />
          <Text style={[styles.tournamentData, styles.customFont]}>Canada</Text>
          <Text style={[styles.dateData, styles.customFont]}>12/04/24</Text>
          <Text style={[styles.plData, styles.customFont, { color: 'red'}]}>-$10</Text>
          <AntDesign name="pluscircle" size={18} style={styles.seeMore} color="black" />
        </View>   
        <View style={styles.rowGridData}>
        <Ionicons name="golf" size={12}  marginHorizontal={4} color="black" />
          <Text style={[styles.tournamentData, styles.customFont]}>Canada</Text>
          <Text style={[styles.dateData, styles.customFont]}>12/04/24</Text>
          <Text style={[styles.plData, styles.customFont, { color: 'red'}]}>-$10</Text>
          <AntDesign name="pluscircle" size={18} style={styles.seeMore} color="black" />
        </View>   
        <View style={styles.rowGridData}>
        <Ionicons name="golf" size={12}  marginHorizontal={4} color="black" />
          <Text style={[styles.tournamentData, styles.customFont]}>Canada</Text>
          <Text style={[styles.dateData, styles.customFont]}>12/04/24</Text>
          <Text style={[styles.plData, styles.customFont, { color: 'red'}]}>-$10</Text>
          <AntDesign name="pluscircle" size={18} style={styles.seeMore} color="black" />
        </View>   
        <View style={styles.rowGridData}>
        <Ionicons name="golf" size={12}  marginHorizontal={4} color="black" />
          <Text style={[styles.tournamentData, styles.customFont]}>Canada</Text>
          <Text style={[styles.dateData, styles.customFont]}>12/04/24</Text>
          <Text style={[styles.plData, styles.customFont, { color: 'red'}]}>-$10</Text>
          <AntDesign name="pluscircle" size={18} style={styles.seeMore} color="black" />
        </View>                
      </View>
      </ScrollView>

      <View style={styles.btnCont}>
        <TouchableOpacity style={{...styles.button, backgroundColor: "#008001"}} onPress={() => navigation.navigate('')}>
          <Text style={[styles.buttonText, styles.customFont]}>Create Bet!</Text>
        </TouchableOpacity> 
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('')}>
          <Text style={[styles.buttonText, styles.customFont]}>See Tournaments</Text>
        </TouchableOpacity>
        </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  wallet:{
    color: "black",
    fontSize: 30,
  },
  walletCont:{
   width: "100%",
   alignItems: 'center',
   marginTop: 20,
   marginBottom: 10,
  },
  iconRow:{
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15
  },
  dashboard:{
    fontSize: 20,
    padding: 5,
    textAlign: "center",
    color: '#2296F3',
  },
  customFont: {
    fontFamily: 'kanitBold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    height: 60,
    width: '100%',
    padding: 10, 
    backgroundColor: "black",

  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(216, 203, 132, 0.664)',  
  },
  button: {
    backgroundColor: '#2296F3',
    padding: 5,
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#233742',
    borderBottomWidth: 4, 
    marginTop: 15,
},
  buttonText: {
    color: 'black',
    fontSize: 15, 
  },
  divider: {
    height: 2, // altura de la línea
    backgroundColor: 'grey', // color de la línea
    width: '100%', // ancho de la línea
  },
  containerGrid: {
  },
  rowGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    paddingVertical: 6,
    backgroundColor: "black",
    paddingHorizontal: 30,
    paddingTop: 10,  
    marginBottom: 15,
  },
  tournament: {
    flex: 3,
    textAlign: 'left',
    color:"#2296F3"
  },
  date: {
    flex: 1,
    textAlign: 'center',
    color:"#2296F3"
  },
  pl: {
    flex: 1,
    textAlign: 'center',
    color:"#2296F3"
  },
  title:{
  fontSize: 17,
  paddingHorizontal: 30,
  backgroundColor: "black",
   color:"#2296F3",
   paddingTop: 10,
  },
  containerGridData: {
    paddingHorizontal: 30,
  },
  rowGridData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    paddingTop: 15,
  },
  tournamentData: {
    flex: 3,
    textAlign: 'left',
      fontSize: 13,
  },
  dateData: {
    flex: 1,
    textAlign: 'center',
      fontSize: 13,
  },
  plData: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
  },
  seeMore:{
    position: "relative",
    left: 20,
  },
  btnCont:{
    alignItems: "center",
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  }
});

export default Home;
