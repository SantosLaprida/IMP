import { fetchQuarterQualifiers } from '../server/firestoreFunctions';
import React, { useState, useEffect } from 'react';
import { compareScores, showResults } from './QuarterUtils'

import { View, Text, StyleSheet, Image, ImageBackground, Button, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { set } from 'firebase/database';

const QuarterFinals = ({ navigation }) => {
  const [ids, setIds] = useState(Array(8).fill(null)); // Marcar posición con null
  const [results1, setResults1] = useState(null);
  const [results2, setResults2] = useState(null);
  const [results3, setResults3] = useState(null);
  const [results4, setResults4] = useState(null);
  const [names, setNames] = useState(Array(8).fill('Loading...')); // Marcar posición con 'Loading...'

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
      if (ids[0] === null || ids[7] === null) {
        console.error('Invalid player IDs for first match:', ids[0], ids[7]);
        return;
      }
      const results = await compareScores(ids[0], ids[7]);
      setResults1(results);
    } catch (error) {
      console.error(error);
    }
  };

  const compareSecondMatch = async (ids) => {
    try {
      if (ids[1] === null || ids[6] === null) {
        console.error('Invalid player IDs for second match:', ids[1], ids[6]);
        return;
      }
      const results = await compareScores(ids[1], ids[6]);
      setResults2(results);
    } catch (error) {
      console.error(error);
    }
  };

  const compareThirdMatch = async (ids) => {
    try {
      if (ids[2] === null || ids[5] === null) {
        console.error('Invalid player IDs for third match:', ids[2], ids[5]);
        return;
      }
      const results = await compareScores(ids[2], ids[5]);
      setResults3(results);
    } catch (error) {
      console.error(error);
    }
  };

  const compareFourthMatch = async (ids) => {
    try {
      if (ids[3] === null || ids[4] === null) {
        console.error('Invalid player IDs for fourth match:', ids[3], ids[4]);
        return;
      }
      const results = await compareScores(ids[3], ids[4]);
      setResults4(results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQualifiers();
  }, []);

  const displayResults = (results, name1, name2) => {
    if (!results) {
      return 'Loading...';
    }
    return showResults(results, name1, name2);
  };

  const displayResultsLeft = (results) => {
    if (!results) {
      return null;
    }
    if (!results.stillPlaying) {
      return null;
    }
    if (results.result < 0) {
      return -1 * results.result + 'UP';
    }
    return null;
  };

  const displayResultsRight = (results) => {
    if (!results) {
      return null;
    }
    if (!results.stillPlaying) {
      return null;
    }
    if (results.result > 0) {
      return results.result + 'UP';
    }
    return null;
  };

  const displayMiddle = (results, name1, name2) => {
    if (!results) {
      return 'Loading...';
    }
    if (results.stillPlaying) {
      return 'Thru ' + results.holesPlayed;
    }
    if (results.result > 0) {
      return name2 + ' Won';
    }
    if (results.result < 0) {
      return name1 + ' Won';
    }
  };

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
          <Text style={{ ...styles.text, marginTop: 5,  backgroundColor: "red", borderRadius: 5, fontSize: 12 }}>{displayResultsLeft(results1)}</Text>
        </View>
        <View style={styles.middle}>
          <Text style={styles.text}>{displayMiddle(results1, names[0], names[7])}</Text>
        </View>
        <View style={styles.player}>
          <Text style={{ ...styles.text, marginBottom: 10 }}>{names[7]}</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={{ ...styles.text, marginTop: 5,  backgroundColor: "red", borderRadius: 5, fontSize: 12 }}>{displayResultsRight(results1)}</Text>
        </View>
      </View>

      <View style={styles.box}>
        <View style={styles.player}>
          <Text style={{ ...styles.text, marginBottom: 10 }}>{names[3]}</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={{ ...styles.text, marginTop: 5,  backgroundColor: "red", borderRadius: 5, fontSize: 12 }}>{displayResultsLeft(results4)}</Text>
        </View>
        <View style={styles.middle}>
          <Text style={styles.text}>{displayMiddle(results4, names[3], names[4])}</Text>
        </View>
        <View style={styles.player}>
          <Text style={{ ...styles.text, marginBottom: 10 }}>{names[4]}</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={{ ...styles.text, marginTop: 5,  backgroundColor: "red", borderRadius: 5, fontSize: 12 }}>{displayResultsRight(results4)}</Text>
        </View>
      </View>
  
    
  
      <View style={styles.box}>
        <View style={styles.player}>
          <Text style={{ ...styles.text, marginBottom: 10 }}>{names[2]}</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={{ ...styles.text, marginTop: 5,  backgroundColor: "red", borderRadius: 5, fontSize: 12 }}>{displayResultsLeft(results3)}</Text>
        </View>
        <View style={styles.middle}>
          <Text style={styles.text}>{displayMiddle(results3, names[2], names[5])}</Text>
        </View>
        <View style={styles.player}>
          <Text style={{ ...styles.text, marginBottom: 10 }}>{names[5]}</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={{ ...styles.text, marginTop: 5,  backgroundColor: "red", borderRadius: 5, fontSize: 12 }}>{displayResultsRight(results3)}</Text>
        </View>
      </View>

      <View style={styles.box}>
        <View style={styles.player}>
          <Text style={{ ...styles.text, marginBottom: 10 }}>{names[1]}</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={{ ...styles.text, marginTop: 5,  backgroundColor: "red", borderRadius: 5, fontSize: 12 }}>{displayResultsLeft(results2)}</Text>
        </View>
        <View style={styles.middle}>
          <Text style={styles.text}>{displayMiddle(results2, names[1], names[6])}</Text>
        </View>
        <View style={styles.player}>
          <Text style={{ ...styles.text, marginBottom: 10 }}>{names[6]}</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={{ ...styles.text, marginTop: 5,  backgroundColor: "red", borderRadius: 5, fontSize: 12 }}>{displayResultsRight(results2)}</Text>
        </View>
      </View>
  
     
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  box: {
    marginBottom: 15,
    flexDirection: "row",
    borderWidth: 5,
    borderColor: 'teal',
    height: 160,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 30,
    width: 370,
    padding: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.788)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
  },
  text: {
    color: "white",
    textAlign: "center",
    fontWeight: "800",
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 20,
  },
  player: {
    flex: 1,
    alignItems: "center",
  },
  middle: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    backgroundColor: 'rgba(226, 202, 64, 0.438)',
    padding: 6,
    borderRadius: 10,
    width: 350,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});

export default QuarterFinals;