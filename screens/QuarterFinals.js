import { fetchQuarterQualifiers } from '../server/firestoreFunctions';
import React, { useState, useEffect } from 'react';
import { compareScores, showResults } from './QuarterUtils'

import { View, Text, StyleSheet, Image, ImageBackground, Button, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { set } from 'firebase/database';

const QuarterFinals = ({ navigation }) => {

  const [ids, setIds] = useState([]);
  const [results1, setResults1] = useState([]);
  const [results2, setResults2] = useState([]);
  const [results3, setResults3] = useState([]);
  const [results4, setResults4] = useState([]);
  const [names, setNames] = useState([]);

  const fetchQualifiers = async () => {
    try {
      const qualifiers = await fetchQuarterQualifiers();
      const names = qualifiers.map(qualifier => qualifier.name);
      const ids = qualifiers.map(qualifier => qualifier.id_player);
      console.log('Fetched IDs:', ids); 
      setNames(names);
      setIds(ids);
      await compareMatches(ids); 
    } catch (error) {
      console.error(error);
    }
  };

  const compareMatches = async (ids) => {
    await Promise.all([
      compareFirstMatch(ids),
      compareSecondMatch(ids),
      compareThirdMatch(ids),
      compareFourthMatch(ids)
    ]);
  };

  const compareFirstMatch = async (ids) => {
    try {
      if (ids[0] === undefined || ids[7] === undefined) {
        console.error('Invalid player IDs for first match:', ids[0], ids[7]);
        return;
      }
      const results = await compareScores(ids[0], ids[7]);
      if (results === null) {
        setResults1(null);
        return;
      }

      setResults1(results);
      
    } catch (error) {
      console.error(error);
    }
  };

  const compareSecondMatch = async (ids) => {
    try {
      if (ids[1] === undefined || ids[6] === undefined) {
        console.error('Invalid player IDs for second match:', ids[1], ids[6]);
        return;
      }
      const results = await compareScores(ids[1], ids[6]);
      if (results === null) {
        return;
      }
      setResults2(results);
    } catch (error) {
      console.error(error);
    }
  };

  const compareThirdMatch = async (ids) => {
    try {
      if (ids[2] === undefined || ids[5] === undefined) {
        console.error('Invalid player IDs for third match:', ids[2], ids[5]);
        return;
      }
      const results = await compareScores(ids[2], ids[5]);
      if (results === null) {
        return;
      }

      setResults3(results);

    } catch (error) {
      console.error(error);
    }
  };

  const compareFourthMatch = async (ids) => {
    try {
      if (ids[3] === undefined || ids[4] === undefined) {
        console.error('Invalid player IDs for fourth match:', ids[3], ids[4]);
        return;
      }
      const results = await compareScores(ids[3], ids[4]);
      if (results === null) {
        return;
      }
      setResults4(results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQualifiers();
  }, []);


  const displayResults = (results, name1, name2) => {
    return showResults(results, name1, name2);
  }


  const displayResultsLeft = (results) => {
    if (results.result < 0){
      return -1 * results.result + 'UP';
    }
    return '';
  }

  const displayResultsRight = (results) => {
    if (results.result > 0){
      return results.result + 'UP';
    }
    return '';
  }


  return (
    <LinearGradient
      colors={['#0d1825', '#2e4857']}
      style={styles.container}
    >  
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Bets')}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
  
      <View style={{ ...styles.box, marginTop: 15 }}>
        <View style={styles.player}>
          <Text style={{ ...styles.text, marginBottom: 10 }}>{names[0]}</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={{ ...styles.text, marginTop: 5 }}>{displayResultsLeft(results1)}</Text>
        </View>
        <View style={styles.player}>
          <Text style={styles.text}>VS</Text>
        </View>
        <View style={styles.player}>
          <Text style={{ ...styles.text, marginBottom: 10 }}>{names[7]}</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={{ ...styles.text, marginTop: 5 }}>{displayResultsRight(results1)}</Text>
        </View>
      </View>
  
      <View style={styles.box}>
        <View style={styles.player}>
          <Text style={{ ...styles.text, marginBottom: 10 }}>{names[1]}</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={{ ...styles.text, marginTop: 5 }}>{displayResultsLeft(results2)}</Text>
        </View>
        <View style={styles.player}>
          <Text style={styles.text}>VS</Text>
        </View>
        <View style={styles.player}>
          <Text style={{ ...styles.text, marginBottom: 10 }}>{names[6]}</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={{ ...styles.text, marginTop: 5 }}>{displayResultsRight(results2)}</Text>
        </View>
      </View>
  
      <View style={styles.box}>
        <View style={styles.player}>
          <Text style={{ ...styles.text, marginBottom: 10 }}>{names[2]}</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={{ ...styles.text, marginTop: 5 }}>{displayResultsLeft(results3)}</Text>
        </View>
        <View style={styles.player}>
          <Text style={styles.text}>VS</Text>
        </View>
        <View style={styles.player}>
          <Text style={{ ...styles.text, marginBottom: 10 }}>{names[5]}</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={{ ...styles.text, marginTop: 5 }}>{displayResultsRight(results3)}</Text>
        </View>
      </View>
  
      <View style={styles.box}>
        <View style={styles.player}>
          <Text style={{ ...styles.text, marginBottom: 10 }}>{names[3]}</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={{ ...styles.text, marginTop: 5 }}>{displayResultsLeft(results4)}</Text>
        </View>
        <View style={styles.player}>
          <Text style={styles.text}>VS</Text>
        </View>
        <View style={styles.player}>
          <Text style={{ ...styles.text, marginBottom: 10 }}>{names[4]}</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={{ ...styles.text, marginTop: 5 }}>{displayResultsRight(results4)}</Text>
        </View>
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

export default QuarterFinals;