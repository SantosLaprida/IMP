import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const PastTournament = ({ route, navigation }) => {
  const { tournament } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: tournament.logo }} style={styles.logo} />
      <Text style={styles.name}>{tournament.name}</Text>
      <Text style={styles.date}>
        {tournament.start_date?.toDate?.().toLocaleDateString()} –{" "}
        {tournament.end_date?.toDate?.().toLocaleDateString()}
      </Text>
      <Text style={styles.description}>
        More tournament details can go here...
      </Text>
      <View style={StyleSheet.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fff",
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
  description: {
    fontSize: 16,
    textAlign: "center",
  },
  backButtonContainer: {
    width: 300,
    alignItems: "center",
    margin: 8,
    backgroundColor: "rgb(255, 252, 241)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    borderRadius: 15,
    padding: 5,
    marginHorizontal: 20,
    marginTop: 20,
  },
  backButton: {
    backgroundColor: "#1f3a5c",
    padding: 6,
    margin: 5,
    marginTop: 30,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
    borderWidth: 0,
    borderColor: "#17628b94",
    borderBottomWidth: 7,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
  },
  backButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "p-semibold",
    position: "relative",
    bottom: -2,
  },
});

export default PastTournament;
