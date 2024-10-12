import { fetchPlayers, storeTeam, fetchTeamAPI } from "../api";
import {
  fetchTournament,
  userMadeBet,
  getNumberPlayersBet,
  getMinimumClassification,
  updateBetCount,
} from "../server/firestoreFunctions";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../server/firebaseConfig";
import { Feather } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Players = ({ navigation }) => {
  const [equipo, setEquipo] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [originalJugadores, setOriginalJugadores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasBet, setHasBet] = useState(false);
  const [limit, setLimit] = useState(null);
  const [classification, setClassification] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tournamentId = await getTournamentId();
        const data = await fetchPlayers(tournamentId);
        const limit = await getNumberPlayersBet(tournamentId);
        setLimit(limit);
        setJugadores(data);
        setOriginalJugadores(data);

        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;

          // Verificar si el usuario ya hizo una apuesta
          const betMade = await userMadeBet(tournamentId, userId);
          setHasBet(betMade); // Actualiza el estado hasBet

          const userTeam = await fetchTeamAPI(tournamentId, userId);
          if (userTeam) {
            const teamArray = Object.values(userTeam);

            const mappedTeam = teamArray
              .map((playerId) => {
                return data.find((player) => player.id_player === playerId);
              })
              .filter((player) => player); // Filtrar resultados undefined

            setEquipo(mappedTeam);

            // Remover jugadores del equipo de la lista de jugadores disponibles
            setJugadores((prevJugadores) =>
              prevJugadores.filter(
                (jugador) =>
                  !mappedTeam.some(
                    (player) => player.id_player === jugador.id_player
                  )
              )
            );
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTournamentId = async () => {
    try {
      const tournament = await fetchTournament();
      console.log("Returning tournament ID:", tournament[0].id);
      return tournament[0].id;
    } catch (error) {
      console.error("Error fetching tournament data:", error);
      throw error;
    }
  };

  const agregarJugadorAlEquipo = (jugador, limit) => {
    if (equipo.length >= limit) {
      alert(`You can only select a maximum of ${limit} players`);
      return;
    }
    setEquipo((prevEquipo) => [...prevEquipo, jugador]);
    setJugadores((prevJugadores) =>
      prevJugadores.filter((j) => j.id_player !== jugador.id_player)
    );
  };
  const getButtonText = () => {
    if (hasBet) {
      return "Change my bet";
    } else {
      return "Place my bet";
    }
  };

  const quitarJugadorDelEquipo = (jugador) => {
    setEquipo((prevEquipo) =>
      prevEquipo.filter((j) => j.id_player !== jugador.id_player)
    );
    setJugadores((prevJugadores) => [...prevJugadores, jugador]);
  };

  const handleFinish = async () => {
    if (equipo.length < limit) {
      alert(`please select ${limit} players`);
      return;
    }

    const userId = await retrieveUser();
    console.log("User ID:", userId);

    const playersIds = equipo.map((jugador) => jugador.id_player);
    console.log("Team:", playersIds);

    const playerNames = equipo.map((jugador) => jugador.name);

    try {
      const tournamentId = await getTournamentId();
      await storeTeam(userId, playersIds, tournamentId);
      await updateBetCount(tournamentId, playerNames);
      console.log("Team stored successfully");
      alert("Bet placed succesfully");

      navigation.navigate("Bets");
    } catch (error) {
      console.error("Failed to store team:", error);
    }

    await AsyncStorage.setItem("equipo", JSON.stringify(equipo));
    setEquipo([]);
    setJugadores(originalJugadores);
  };

  const retrieveUser = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user !== null) {
        return JSON.parse(user).uid; // Use the UID instead of id_member
      }
    } catch (error) {
      console.error(error);
    }
  };

  const teamPlayerIds = new Set(equipo.map((player) => player.id_player));

  const filteredJugadores = jugadores.filter(
    (jugador) =>
      !teamPlayerIds.has(jugador.id_player) &&
      (jugador.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jugador.rank.toString().includes(searchTerm))
  );

  return (
    <LinearGradient
      colors={["#17628b34", "white"]}
      locations={[0, 15]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.box}>
          <Text
            style={{
              ...styles.text,
              fontSize: 15,
              marginTop: -5,
              paddingBottom: 10,
            }}
          >
            Choose 8 players
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setSearchTerm(text)}
            value={searchTerm}
            placeholder="Search players"
            placeholderTextColor="#1f3a5c"
          />
          <View style={styles.itemTitle}>
            <Text style={styles.text}>Player</Text>
            <Text style={styles.text}>Ranking</Text>
          </View>
          {loading ? (
            <ActivityIndicator
              style={styles.loader}
              size="large"
              color="#1f3a5c"
            />
          ) : (
            <ScrollView
              style={styles.scroll}
              showsVerticalScrollIndicator={false}
            >
              {filteredJugadores.map((jugador) => (
                <TouchableOpacity
                  key={jugador.id_player}
                  onPress={() => agregarJugadorAlEquipo(jugador, limit)}
                >
                  <View
                    style={{
                      ...styles.jugadorItem,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ ...styles.text, fontSize: 11 }}>
                      {jugador.name}
                    </Text>
                    <Text style={{ ...styles.text, fontSize: 11 }}>
                      {jugador.rank}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={{ ...styles.box, height: 270 }}>
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.itemTitle}>
              <Text style={styles.text}>Your players</Text>
              <Text style={styles.text}>
                {"N° of players: " + equipo.length}
              </Text>
            </View>
            {equipo.map((jugador) => (
              <TouchableOpacity
                key={jugador.id_player}
                onPress={() => quitarJugadorDelEquipo(jugador)}
              >
                <View
                  style={{
                    ...styles.jugadorItem,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ ...styles.text, fontSize: 11 }}>
                    {jugador.name}
                  </Text>
                  <Text style={{ ...styles.text, fontSize: 11 }}>
                    {jugador.rank}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.btns}>
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: "#1f3a5c" }}
            onPress={handleFinish}
          >
            <Text style={{ ...styles.buttonText, color: "white" }}>
              {getButtonText()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: "red" }}
          >
            <Text style={{ ...styles.buttonText, color: "white" }}>
              Delete Bet
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Bets")}
        >
          <Text style={styles.buttonText}>Go back</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  box: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: "center",
    backgroundColor: "rgb(255, 252, 241)",
    height: 380,
    marginBottom: 10,
    shadowColor: "#000", // Color de la sombra
    shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 6, // Radio de la sombra
    // Para Android
    elevation: 10, // Elevación para la sombra
  },
  itemTitle: {
    borderRadius: 5,
    width: 250,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  jugadorItem: {
    padding: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    width: 250,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 13,
    textAlign: "left",
    fontWeight: "700",
    color: "#1f3a5c",
  },
  btn: {
    width: 300,
    borderRadius: 20,
    fontFamily: "Roboto",
  },
  scroll: {
    width: 250,
  },
  input: {
    width: 250,
    borderColor: "#1f3a5c",
    borderWidth: 1,
    padding: 5,
    fontSize: 12,
    color: "#1f3a5c",
    borderRadius: 5,
    height: 30,
  },
  button: {
    backgroundColor: "#17628b34",
    padding: 6,
    margin: 5,
    borderRadius: 10,
    width: 170,
    alignItems: "center",
    borderWidth: 0,
    borderColor: "#17628b94",
    borderBottomWidth: 7,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
  },
  buttonText: {
    color: "#1f3a5c",
    fontSize: 14,
    fontFamily: "p-semibold",
    position: "relative",
    bottom: -2,
  },
  btns: {
    flexDirection: "row",
    marginTop: 10,
  },
  loader: {
    marginTop: 50,
  },
  arrowCont: {
    justifyContent: "center",
    alignItems: "center",
  },
  arrows: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    width: 250,
  },
  element: {
    padding: 5,
    textAlign: "center",
  },
});

export default Players;
