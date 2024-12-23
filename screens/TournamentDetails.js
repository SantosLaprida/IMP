import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";

const TournamentDetails = ({ route }) => {
  // Access the passed data from route.params
  const { jugadores, name, start_date, end_date, logo } = route.params;
  console.log(jugadores);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoBox}>
        <Image source={{ uri: logo }} style={styles.logo} />
      </View>

      <Text style={styles.title}>{name}</Text>

      <Text style={styles.subtitle}>Start Date: {start_date}</Text>
      <Text style={styles.subtitle}>End Date: {end_date}</Text>
      <Text style={styles.subtitle}>Number of Players: {jugadores.length}</Text>

      <Text style={styles.title}>Players</Text>
      <FlatList
        data={jugadores}
        keyExtractor={(item) => item.id_player}
        renderItem={({ item }) => (
          <View style={styles.playerItem}>
            <Text style={styles.playerName}>{item.name}</Text>
            <Text style={styles.playerRank}>Rank: {item.rank}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
    alignItems: "center", // This moves everything inside the ScrollView to the center
  },
  logoBox: {
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 100,
    borderRadius: 10,
    backgroundColor: "black",
    padding: 5,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#1f3a5c",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
    color: "#333",
  },
  playerItem: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  playerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f3a5c",
  },
  playerRank: {
    fontSize: 14,
    color: "#666",
  },
});

export default TournamentDetails;
