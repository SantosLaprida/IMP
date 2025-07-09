import { fetchPastTournaments } from "../server/firestore/tournaments";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const PastTournaments = ({ navigation }) => {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const getTournaments = async () => {
      try {
        const fetchedTournaments = await fetchPastTournaments();

        console.log("Fetched tournaments:", fetchedTournaments);

        setTournaments(fetchedTournaments);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    };

    getTournaments();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {tournaments.map((tournament) => (
          <TouchableOpacity
            key={tournament.id}
            style={styles.tournamentCard}
            onPress={() =>
              navigation.navigate("PastTournament", { tournament })
            }
          >
            <Image source={{ uri: tournament.logo }} style={styles.logo} />
            <Text style={styles.tournamentName}>{tournament.name}</Text>
            <Text style={styles.tournamentDate}>
              {tournament.start_date?.toDate?.().toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
    padding: 16,
    paddingTop: 100,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#f2f2f2",
  },
  tournamentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  backButtonContainer: {
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
  },

  backButton: {
    backgroundColor: "#1f3a5c",
    padding: 6,
    margin: 5,
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

  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 10,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  tournamentDate: {
    fontSize: 14,
    color: "#666",
  },
});

export default PastTournaments;
