import React, { use } from "react";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import {
  fetchBracketPlayers,
  fetchTournamentWinner,
} from "../server/firestore/players";

const MatchBlock = ({ player1, player2 }) => (
  <View style={styles.matchBlock}>
    <View style={styles.playerRow}>
      <Text style={styles.playerName}>{player1}</Text>
    </View>
    <View style={styles.playerRow}>
      <Text style={styles.playerName}>{player2}</Text>
    </View>
  </View>
);

const renderMatches = (players) => {
  const matches = [];
  for (let i = 0; i < players.length; i += 2) {
    const player1 = players[i]?.name || "TBD";
    const player2 = players[i + 1]?.name || "TBD";
    matches.push(<MatchBlock key={i} player1={player1} player2={player2} />);
  }
  return matches;
};

const PastTournament = ({ route, navigation }) => {
  const { tournament } = route.params;
  const [quarterFinals, setQuarterFinals] = useState([]);
  const [semiFinals, setSemiFinals] = useState([]);
  const [finals, setFinals] = useState([]);
  const [winner, setWinner] = useState([]);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const qf = await fetchBracketPlayers(tournament.id, "I_Cuartos");
        const sf = await fetchBracketPlayers(tournament.id, "I_Semifinales");
        const final = await fetchBracketPlayers(tournament.id, "I_Finales");
        const winner = await fetchTournamentWinner(tournament.id);
        setQuarterFinals(qf);
        setSemiFinals(sf);
        setFinals(final);
        setWinner(winner);
      } catch (error) {
        console.error("Error loading matches:", error);
      }
    };
    loadMatches();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: tournament.logo }} style={styles.logo} />
        <Text style={styles.name}>{tournament.name}</Text>
        <Text style={styles.date}>
          {tournament.start_date?.toDate?.().toLocaleDateString()} –{" "}
          {tournament.finish_date?.toDate?.().toLocaleDateString()}
        </Text>

        {winner && (
          <View style={{ marginVertical: 20, alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#1f3a5c" }}>
              🏆 Winner:
            </Text>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "#00796b" }}
            >
              {winner}
            </Text>
          </View>
        )}
        <Text style={styles.bracketTitle}>Tournament Bracket</Text>

        <ScrollView horizontal contentContainerStyle={styles.bracketContainer}>
          <View style={styles.bracketSection}>
            <Text style={styles.roundTitle}>Quarterfinals</Text>
            {renderMatches(quarterFinals)}
          </View>

          <View style={styles.bracketSection}>
            <Text style={styles.roundTitle}>Semifinals</Text>
            {renderMatches(semiFinals)}
          </View>

          <View style={styles.bracketSection}>
            <Text style={styles.roundTitle}>Final</Text>
            {renderMatches(finals)}
          </View>
        </ScrollView>
      </ScrollView>

      {/* Back Button BELOW scroll view */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 30,
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 150,
    resizeMode: "contain",
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 3,
  },
  date: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  bracketTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#1f3a5c",
  },
  bracketContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  bracketSection: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  roundTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#1f3a5c",
  },
  matchBlock: {
    backgroundColor: "#e0f7fa",
    padding: 8,
    borderRadius: 8,
    marginVertical: 10,
    width: 140,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  player: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f3a5c",
  },
  backButtonContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  backButton: {
    backgroundColor: "#1f3a5c",
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "p-semibold",
  },

  playerRow: {
  flexDirection: "row",
  justifyContent: "flex-start",
},

playerName: {
  fontSize: 14,
  fontWeight: "500",
  minWidth: 120, // ensures names align in the same column
  textAlign: "left",
},
});

export default PastTournament;
