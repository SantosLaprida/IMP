import {
  fetchTournament,
  fetchThirdPlaceQualifiers,
} from "../server/firestoreFunctions";
import React, { useState, useEffect } from "react";
import { compareScores, showResults } from "../server/matchUtils/matchUtils";

import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Button,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { set } from "firebase/database";

const ThirdPlace = ({ navigation }) => {
  const [ids, setIds] = useState(Array(2).fill(null));
  const [results1, setResults1] = useState(null);
  const [names, setNames] = useState(Array(2).fill("Loading..."));

  const fetchQualifiers = async () => {
    try {
      const tournamentId = await getTournamentId();
      const qualifiers = await fetchThirdPlaceQualifiers(tournamentId);
      const names = qualifiers.map((qualifier) => qualifier.name);
      console.log(names, "INSIDE fetchQualifiers THIRDPLACE");
      const ids = qualifiers.map((qualifier) => qualifier.id_player);
      setNames(names);
      setIds(ids);
      await compareMatches(ids);
    } catch (error) {
      console.error(error);
    }
  };

  const getTournamentId = async () => {
    try {
      const tournament = await fetchTournament();
      return tournament[0].id;
    } catch (error) {
      console.error("Error fetching tournament data:", error);
      throw error;
    }
  };

  const compareMatches = async (ids) => {
    await Promise.all([compareFirstMatch(ids)]);
  };

  const compareFirstMatch = async (ids) => {
    try {
      if (ids[0] === null || ids[1] === null) {
        console.error("Invalid player IDs for first match:", ids[0], ids[1]);
        return;
      }
      const tournamentId = await getTournamentId();
      const collectionName = "I_TercerCuarto";
      const results = await compareScores(
        ids[0],
        ids[1],
        tournamentId,
        collectionName
      );
      setResults1(results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQualifiers();
  }, []);

  const displayResults = (results, name1, name2) => {
    if (!results) {
      return "Loading...";
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
      return -1 * results.result + "UP";
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
      return results.result + "UP";
    }
    return null;
  };

  const displayMiddle = (results, name1, name2) => {
    if (!results) {
      return "Loading...";
    }
    if (results.stillPlaying) {
      return "Thru " + results.holesPlayed;
    }
    if (results.result > 0) {
      return name2 + " Won";
    }
    if (results.result < 0) {
      return name1 + " Won";
    }
  };

  return (
    <LinearGradient colors={["#0d1825", "#2e4857"]} style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Bets")}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>

      <View style={{ ...styles.box, marginTop: 15 }}>
        <View style={styles.player}>
          <Text style={{ ...styles.text, marginBottom: 10 }}>{names[0]}</Text>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />
          <Text
            style={{
              ...styles.text,
              marginTop: 5,
              backgroundColor: "red",
              borderRadius: 5,
              fontSize: 12,
            }}
          >
            {displayResultsLeft(results1)}
          </Text>
        </View>
        <View style={styles.middle}>
          <Text style={styles.text}>
            {displayMiddle(results1, names[0], names[1])}
          </Text>
        </View>
        <View style={styles.player}>
          <Text style={{ ...styles.text, marginBottom: 10 }}>{names[1]}</Text>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />
          <Text
            style={{
              ...styles.text,
              marginTop: 5,
              backgroundColor: "red",
              borderRadius: 5,
              fontSize: 12,
            }}
          >
            {displayResultsRight(results1)}
          </Text>
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
    borderColor: "teal",
    height: 160,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 30,
    width: 370,
    padding: 30,
    marginVertical: 30,
    backgroundColor: "rgba(0, 0, 0, 0.788)",
  },
  container: {
    flex: 1,
    alignItems: "center",
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
    backgroundColor: "rgba(212, 188, 50, 0.76)",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3.84,
    // Sombra para Android
    elevation: 30,
  },
  buttonText: {
    color: "#15303F",
    fontSize: 20,
    fontWeight: "600",
  },
});

export default ThirdPlace;
