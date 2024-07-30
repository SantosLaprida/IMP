import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const Results = ({ navigation }) => {
  const positions = [
    { id: "1", position: "1st Place - Team A" },
    { id: "2", position: "2nd Place - Team B" },
    { id: "3", position: "3rd Place - Team C" },
    { id: "4", position: "4th Place - Team D" },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item.position}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Results</Text>
      <FlatList
        data={positions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
