import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

import { fetchTournament } from "../server/firestoreFunctions";
import { fetchFinalResults } from "../server/finalsUtils/finalsUtils";

const Results = ({ navigation }) => {
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTournamentId = async () => {
      try {
        const tournament = await fetchTournament();
        return tournament[0].id;
      } catch (error) {
        console.error("Error fetching tournament data:", error);
        throw error;
      }
    };

    const fetchResults = async () => {
      try {
        const tournamentId = await getTournamentId();
        const names = await fetchFinalResults(tournamentId);
        setNames(names);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResults();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Names</Text>
      <FlatList
        data={names}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  text: {
    fontSize: 18,
  },
});

export default Results;
