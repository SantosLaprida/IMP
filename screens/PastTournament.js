import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const MatchBlock = ({ player1, player2 }) => (
  <View style={styles.matchBlock}>
    <Text style={styles.player}>{player1}</Text>
    <Text style={styles.player}>{player2}</Text>
  </View>
);

const PastTournament = ({ route, navigation }) => {
  const { tournament } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: tournament.logo }} style={styles.logo} />
        <Text style={styles.name}>{tournament.name}</Text>
        <Text style={styles.date}>
          {tournament.start_date?.toDate?.().toLocaleDateString()} –{" "}
          {tournament.end_date?.toDate?.().toLocaleDateString()}
        </Text>

        <Text style={styles.bracketTitle}>Tournament Bracket</Text>

        <ScrollView horizontal contentContainerStyle={styles.bracketContainer}>
          <View style={styles.bracketSection}>
            <Text style={styles.roundTitle}>Quarterfinals</Text>
            <MatchBlock player1="Player A1" player2="Player A2" />
            <MatchBlock player1="Player B1" player2="Player B2" />
            <MatchBlock player1="Player C1" player2="Player C2" />
            <MatchBlock player1="Player D1" player2="Player D2" />
          </View>

          <View style={styles.bracketSection}>
            <Text style={styles.roundTitle}>Semifinals</Text>
            <MatchBlock player1="Winner A" player2="Winner B" />
            <MatchBlock player1="Winner C" player2="Winner D" />
          </View>

          <View style={styles.bracketSection}>
            <Text style={styles.roundTitle}>Final</Text>
            <MatchBlock player1="Winner SF1" player2="Winner SF2" />
          </View>
        </ScrollView>
      </ScrollView>

      {/* Back Button OUTSIDE scroll view */}
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
    marginTop: 50,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
    resizeMode: "contain",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
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
});

export default PastTournament;
