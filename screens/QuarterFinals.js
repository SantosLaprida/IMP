import { getPlayerName } from "../server/firestore/players";
import { getHoles } from "../server/firestore/utils";
import {
  fetchTournament,
  fetchQualifiers,
} from "../server/firestore/tournaments";
import React, { useState, useEffect } from "react";
import { compareScores, showResults } from "../server/matchUtils/matchUtils";

import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { set } from "firebase/database";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { reload } from "firebase/auth";
import { useRoute } from "@react-navigation/native";

const QuarterFinals = ({ navigation }) => {
  const route = useRoute();
  const { origin } = route.params;

  const handleNavigate = (origin) => {
    navigation.navigate(origin);
  };

  const [ids, setIds] = useState(Array(8).fill(null)); // Marcar posición con null
  const [results1, setResults1] = useState(null);
  const [results2, setResults2] = useState(null);
  const [results3, setResults3] = useState(null);
  const [results4, setResults4] = useState(null);
  const [names, setNames] = useState(Array(8).fill("Loading..."));
  const [loading, setLoading] = useState(true);

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [logo, setLogo] = useState(null);
  const [name, setName] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [player1Scores, setPlayer1Scores] = useState([]);
  const [player2Scores, setPlayer2Scores] = useState([]);
  const [player1Name, setPlayer1Name] = useState(null);
  const [player2Name, setPlayer2Name] = useState(null);

  const holes = Array.from({ length: 18 }, (_, i) => i + 1);

  const showHoles = async (player1Id, player2Id) => {
    setModalVisible(true);
    try {
      let tournamentId = await getTournamentId();
      let collection = "I_Cuartos";

      // Llamada al backend para obtener el scoresheet
      const response = await getHoles(
        tournamentId,
        collection,
        player1Id,
        player2Id
      );

      const name1 = await getPlayerName(player1Id, tournamentId);
      const name2 = await getPlayerName(player2Id, tournamentId);

      if (response) {
        // Actualizamos el estado con los scores de los jugadores
        console.log(response);
        setPlayer1Scores(response.player1Holes);
        setPlayer2Scores(response.player2Holes);
        setPlayer1Name(name1);
        setPlayer2Name(name2);
        console.log(player1Scores, player2Scores);
      } else {
        console.error("Error al obtener los scoresheets.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const getTournamentData = async () => {
      try {
        const torneo = await fetchTournament();

        let name = torneo[0].name;
        let start_date = torneo[0].start_date;
        let finish_date = torneo[0].finish_date;
        let logo = torneo[0].logo;

        setName(name);
        setStart(start_date);
        setEnd(finish_date);
        setLogo(logo);
      } catch (error) {
        console.error(error);
      }
    };

    getTournamentData();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const tournamentId = await getTournamentId();
      const qualifiers = await fetchQualifiers(tournamentId, "I_Cuartos");
      const names = qualifiers.map((qualifier) => qualifier.name);
      const ids = qualifiers.map((qualifier) => qualifier.id_player);
      setNames(names);
      setIds(ids);
      await compareMatches(ids);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
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
    await Promise.all([
      compareFirstMatch(ids),
      compareSecondMatch(ids),
      compareThirdMatch(ids),
      compareFourthMatch(ids),
    ]);
  };

  const compareFirstMatch = async (ids) => {
    try {
      if (ids[0] === null || ids[7] === null) {
        console.error("Invalid player IDs for first match:", ids[0], ids[7]);
        return;
      }
      const collectionName = "I_Cuartos";
      const tournamentId = await getTournamentId();
      const results = await compareScores(
        ids[0],
        ids[7],
        tournamentId,
        collectionName
      );
      setResults1(results);
    } catch (error) {
      console.error(error);
    }
  };

  const compareSecondMatch = async (ids) => {
    try {
      if (ids[1] === null || ids[6] === null) {
        console.error("Invalid player IDs for second match:", ids[1], ids[6]);
        return;
      }
      const collectionName = "I_Cuartos";
      const tournamentId = await getTournamentId();
      const results = await compareScores(
        ids[1],
        ids[6],
        tournamentId,
        collectionName
      );
      setResults2(results);
    } catch (error) {
      console.error(error);
    }
  };

  const compareThirdMatch = async (ids) => {
    try {
      if (ids[2] === null || ids[5] === null) {
        console.error("Invalid player IDs for third match:", ids[2], ids[5]);
        return;
      }
      const collectionName = "I_Cuartos";
      const tournamentId = await getTournamentId();
      const results = await compareScores(
        ids[2],
        ids[5],
        tournamentId,
        collectionName
      );
      setResults3(results);
    } catch (error) {
      console.error(error);
    }
  };

  const compareFourthMatch = async (ids) => {
    try {
      if (ids[3] === null || ids[4] === null) {
        console.error("Invalid player IDs for fourth match:", ids[3], ids[4]);
        return;
      }
      const collectionName = "I_Cuartos";
      const tournamentId = await getTournamentId();
      const results = await compareScores(
        ids[3],
        ids[4],
        tournamentId,
        collectionName
      );
      setResults4(results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const displayResultsLeft = (results) => {
    if (!results) {
      return null;
    }
    if (!results.stillPlaying) {
      return null;
    }
    if (results.result < 0) {
      return -1 * results.result + "-UP";
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
      return results.result + "-UP";
    }
    return null;
  };

  const displayMiddle = (results, name1, name2) => {
    if (!results) {
      return null;
    }
    if (results.stillPlaying) {
      return "Thru " + results.holesPlayed;
    } else {
      return null;
    }
  };
  const displayMiddleResult = (results, name1, name2) => {
    if (!results) {
      return null;
    }
    if (results.stillPlaying && results.result === 0) {
      return "All Square";
    }
    if (!results.stillPlaying && results.result > 0) {
      return name2 + " Won";
    }
    if (!results.stillPlaying && results.result < 0) {
      return name1 + " Won";
    }
  };

  return (
    <LinearGradient
      colors={["#17628b34", "white"]}
      locations={[0, 15]}
      style={styles.container}
    >
      {/* CONTAINER DE ARRIBA */}
      <View style={styles.box}>
        <Text
          style={{
            ...styles.text,
            paddingBottom: 5,
            fontSize: 15,
            marginTop: 0,
            fontSize: 18,
            fontFamily: "p-bold",
            textDecorationLine: "underline",
          }}
        >
          {name}
        </Text>
        <View style={styles.logoBox}>
          <Image source={{ uri: logo }} style={styles.logo} />
        </View>
        <View>
          <Text style={{ ...styles.text, fontSize: 10 }}>
            {"Finish date: " + end}
          </Text>
        </View>
      </View>
      {/* CONTAINER DE ABAJO */}
      <View style={{ ...styles.box, height: 450 }}>
        <Text
          style={{
            ...styles.text,
            fontSize: 18,
            textDecorationLine: "underline",
            fontFamily: "p-bold",
            marginBottom: 15,
          }}
        >
          Quarter Finals
        </Text>

        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color="#1f3a5c"
          />
        ) : (
          <>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* GAME 1 */}
              <View style={styles.gameBox}>
                <Text style={styles.tGame}>Game 1</Text>
                <Text
                  style={[
                    styles.text_left,
                    {
                      backgroundColor: displayResultsLeft(results1)
                        ? "red"
                        : "transparent",
                    },
                  ]}
                >
                  {displayResultsLeft(results1)}
                </Text>
                <View style={styles.player}>
                  <Image
                    source={require("../assets/images/scottie.webp")}
                    style={styles.gameLogo}
                  />
                  <Text
                    style={{
                      ...styles.text,
                      marginBottom: 5,
                      fontSize: 10,
                      paddingHorizontal: 20,
                      textAlign: "center",
                    }}
                  >
                    {names[0]}
                  </Text>
                </View>
                <View style={styles.middle}>
                  <Text style={{ ...styles.text, fontSize: 12 }}>
                    {displayMiddle(results1, names[0], names[7])}
                  </Text>
                  <MaterialCommunityIcons
                    style={styles.vsIcon}
                    name="sword-cross"
                    size={24}
                    color="#1f3a5c"
                  />
                  <Text
                    style={{
                      ...styles.text,
                      fontSize: 12,
                      color: "green",
                      textAlign: "center",
                    }}
                  >
                    {displayMiddleResult(results1, names[0], names[7])}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.text_right,
                    {
                      backgroundColor: displayResultsRight(results1)
                        ? "red"
                        : "transparent",
                    },
                  ]}
                >
                  {displayResultsRight(results1)}
                </Text>
                <View style={styles.player}>
                  <Image
                    source={require("../assets/images/scottie.webp")}
                    style={styles.gameLogo}
                  />
                  <Text
                    style={{
                      ...styles.text,
                      marginBottom: 5,
                      fontSize: 10,
                      paddingHorizontal: 20,
                      textAlign: "center",
                    }}
                  >
                    {names[7]}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => showHoles(ids[0], ids[7])}
                style={styles.detailBtn}
              >
                <Text style={{ ...styles.text, fontSize: 12, marginTop: 3 }}>
                  Details
                </Text>
              </TouchableOpacity>
              {/* GAME 2 */}
              <View style={styles.gameBox}>
                <Text style={styles.tGame}>Game 2</Text>
                <Text
                  style={[
                    styles.text_left,
                    {
                      backgroundColor: displayResultsLeft(results4)
                        ? "red"
                        : "transparent",
                    },
                  ]}
                >
                  {displayResultsLeft(results4)}
                </Text>
                <View style={styles.player}>
                  <Image
                    source={require("../assets/images/scottie.webp")}
                    style={styles.gameLogo}
                  />
                  <Text
                    style={{
                      ...styles.text,
                      marginBottom: 5,
                      fontSize: 10,
                      paddingHorizontal: 20,
                      textAlign: "center",
                    }}
                  >
                    {names[3]}
                  </Text>
                </View>
                <View style={styles.middle}>
                  <Text style={{ ...styles.text, fontSize: 12 }}>
                    {displayMiddle(results4, names[3], names[4])}
                  </Text>
                  <MaterialCommunityIcons
                    style={styles.vsIcon}
                    name="sword-cross"
                    size={24}
                    color="#1f3a5c"
                  />
                  <Text
                    style={{
                      ...styles.text,
                      fontSize: 12,
                      color: "green",
                      textAlign: "center",
                    }}
                  >
                    {displayMiddleResult(results4, names[3], names[4])}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.text_right,
                    {
                      backgroundColor: displayResultsRight(results4)
                        ? "red"
                        : "transparent",
                    },
                  ]}
                >
                  {displayResultsRight(results4)}
                </Text>

                <View style={styles.player}>
                  <Image
                    source={require("../assets/images/scottie.webp")}
                    style={styles.gameLogo}
                  />
                  <Text
                    style={{
                      ...styles.text,
                      marginBottom: 5,
                      fontSize: 10,
                      paddingHorizontal: 20,
                      textAlign: "center",
                    }}
                  >
                    {names[4]}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => showHoles(ids[3], ids[4])}
                style={styles.detailBtn}
              >
                <Text style={{ ...styles.text, fontSize: 12, marginTop: 3 }}>
                  Details
                </Text>
              </TouchableOpacity>
              {/* GAME 3*/}
              <View style={styles.gameBox}>
                <Text style={styles.tGame}>Game 3</Text>
                <Text
                  style={[
                    styles.text_left,
                    {
                      backgroundColor: displayResultsLeft(results3)
                        ? "red"
                        : "transparent",
                    },
                  ]}
                >
                  {displayResultsLeft(results3)}
                </Text>
                <View style={styles.player}>
                  <Image
                    source={require("../assets/images/scottie.webp")}
                    style={styles.gameLogo}
                  />
                  <Text
                    style={{
                      ...styles.text,
                      marginBottom: 5,
                      fontSize: 10,
                      paddingHorizontal: 20,
                      textAlign: "center",
                    }}
                  >
                    {names[2]}
                  </Text>
                </View>
                <View style={styles.middle}>
                  <Text style={{ ...styles.text, fontSize: 12 }}>
                    {displayMiddle(results3, names[2], names[5])}
                  </Text>
                  <MaterialCommunityIcons
                    style={styles.vsIcon}
                    name="sword-cross"
                    size={24}
                    color="#1f3a5c"
                  />
                  <Text
                    style={{
                      ...styles.text,
                      fontSize: 12,
                      color: "green",
                      textAlign: "center",
                    }}
                  >
                    {displayMiddleResult(results3, names[2], names[5])}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.text_right,
                    {
                      backgroundColor: displayResultsRight(results3)
                        ? "red"
                        : "transparent",
                    },
                  ]}
                >
                  {displayResultsRight(results3)}
                </Text>
                <View style={styles.player}>
                  <Image
                    source={require("../assets/images/scottie.webp")}
                    style={styles.gameLogo}
                  />
                  <Text
                    style={{
                      ...styles.text,
                      marginBottom: 5,
                      fontSize: 10,
                      paddingHorizontal: 20,
                      textAlign: "center",
                    }}
                  >
                    {names[5]}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => showHoles(ids[2], ids[5])}
                style={styles.detailBtn}
              >
                <Text style={{ ...styles.text, fontSize: 12, marginTop: 3 }}>
                  Details
                </Text>
              </TouchableOpacity>
              {/* GAME 4*/}
              <View style={styles.gameBox}>
                <Text style={styles.tGame}>Game 4</Text>
                <Text
                  style={[
                    styles.text_left,
                    {
                      backgroundColor: displayResultsLeft(results2)
                        ? "red"
                        : "transparent",
                    },
                  ]}
                >
                  {displayResultsLeft(results2)}
                </Text>
                <View style={styles.player}>
                  <Image
                    source={require("../assets/images/scottie.webp")}
                    style={styles.gameLogo}
                  />
                  <Text
                    style={{
                      ...styles.text,
                      marginBottom: 5,
                      fontSize: 10,
                      paddingHorizontal: 20,
                      textAlign: "center",
                    }}
                  >
                    {names[1]}
                  </Text>
                </View>
                <View style={styles.middle}>
                  <Text style={{ ...styles.text, fontSize: 12 }}>
                    {displayMiddle(results2, names[1], names[6])}
                  </Text>
                  <MaterialCommunityIcons
                    style={styles.vsIcon}
                    name="sword-cross"
                    size={24}
                    color="#1f3a5c"
                  />
                  <Text
                    style={{
                      ...styles.text,
                      fontSize: 12,
                      color: "green",
                      textAlign: "center",
                    }}
                  >
                    {displayMiddleResult(results2, names[1], names[6])}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.text_right,
                    {
                      backgroundColor: displayResultsRight(results2)
                        ? "red"
                        : "transparent",
                    },
                  ]}
                >
                  {displayResultsRight(results2)}
                </Text>
                <View style={styles.player}>
                  <Image
                    source={require("../assets/images/scottie.webp")}
                    style={styles.gameLogo}
                  />
                  <Text
                    style={{
                      ...styles.text,
                      marginBottom: 5,
                      fontSize: 10,
                      paddingHorizontal: 20,
                      textAlign: "center",
                    }}
                  >
                    {names[6]}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => showHoles(ids[1], ids[6])}
                style={styles.detailBtn}
              >
                <Text style={{ ...styles.text, fontSize: 12, marginTop: 3 }}>
                  Details
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </>
        )}
      </View>
      <TouchableOpacity
        onPress={() => handleNavigate(origin)}
        style={{
          ...styles.button,
          marginTop: 20,
          backgroundColor: "#1f3a5c",
          width: "85%",
        }}
      >
        <Text style={{ ...styles.buttonText, color: "white" }}>Back</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Scoresheet</Text>
            <ScrollView>
              {/* Encabezado */}
              <View style={styles.gridRow}>
                <Text
                  style={{
                    ...styles.headearHole,
                    borderRightWidth: 1,
                  }}
                >
                  Hole
                </Text>
                <Text
                  style={{
                    ...styles.headerCell,
                    borderRightWidth: 1,
                  }}
                >
                  {player1Name}
                </Text>
                <Text style={styles.headerCell}>{player2Name}</Text>
              </View>

              {/* Filas con datos */}
              {holes.map((hole, index) => (
                <View key={hole} style={styles.gridRow}>
                  <Text
                    style={{
                      ...styles.holeCell,
                      backgroundColor: "rgba(153, 136, 40, 0.336);",
                      borderBottomWidth: 0,
                      borderRightWidth: 1,
                    }}
                  >
                    {hole}
                  </Text>
                  <Text
                    style={{
                      ...styles.gridCell,
                      backgroundColor: "#19898d4d",

                      borderRightWidth: 1,
                    }}
                  >
                    {player1Scores[index] || 0}
                  </Text>
                  <Text
                    style={{
                      ...styles.gridCell,
                      backgroundColor: "#19898d4d",
                    }}
                  >
                    {player2Scores[index] || 0}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                ...styles.button,
                marginVertical: 15,
                backgroundColor: "#1f3a5c",
                width: "85%",
                padding: 3,
              }}
            >
              <Text style={{ ...styles.buttonText, color: "white" }}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.849);",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "rgb(255, 252, 241)",
    borderRadius: 20,
    padding: 5,
    alignItems: "center",
    fontFamily: "p-semibold",
    borderWidth: 1,
    borderColor: "black",
  },
  modalTitle: {
    fontSize: 18,

    marginTop: 10,
    fontFamily: "p-semibold",
    marginBottom: 10,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 0,
    fontFamily: "p-semibold",
    borderBottomWidth: 1,

    borderColor: "black",
  },
  headerCell: {
    flex: 1,
    fontFamily: "p-semibold",
    textAlign: "center",
    fontSize: 10,
    paddingVertical: 5,
  },
  headearHole: {
    flex: 0.5,
    textAlign: "center",
    fontSize: 10,
    fontFamily: "p-semibold",
    paddingVertical: 5,
  },
  gridCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 9,
    paddingVertical: 3,

    fontFamily: "p-bold",
  },
  holeCell: {
    flex: 0.5, // Más angosto para la columna de hoyos
    textAlign: "center",
    fontSize: 9,
    paddingVertical: 3,
    fontFamily: "p-bold",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#1f3a5c",
    borderRadius: 5,
  },

  closeButtonText: {
    color: "white",
    fontSize: 14,
  },

  box: {
    padding: 20,
    alignItems: "center",
    borderRadius: 20,
    width: "90%",
    marginTop: 15,
    backgroundColor: "rgb(255, 252, 241)",
    shadowColor: "#000", // Color de la sombra
    shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 6, // Radio de la sombra
    // Para Android
    elevation: 10, // Elevación para la sombra
  },
  logo: {
    width: 150,
    height: 100,
    borderRadius: 10,
    backgroundColor: "black",
    padding: 5,
  },
  logoBox: {
    backgroundColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    borderRadius: 10,
    padding: 15,

    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  text: {
    fontSize: 15,
    color: "#1f3a5c",
    fontFamily: "p-semibold",
  },
  gameBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,

    width: "100%",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#f0f0f0",
  },
  player: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  gameLogo: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginVertical: 2,
  },
  middle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    height: 100,
    marginBottom: -25,
  },
  button: {
    backgroundColor: "#17628b34",
    padding: 6,
    margin: 5,
    borderRadius: 10,
    width: "80%",
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
  text_left: {
    fontSize: 8,
    width: 30,
    color: "white",
    borderRadius: 5,
    height: 25,
    position: "absolute",
    left: 0,
    top: 0,
    padding: 5,
    fontFamily: "p-semibold",
    backgroundColor: "red",
  },
  text_right: {
    fontSize: 8,
    width: 30,
    color: "white",
    borderRadius: 5,
    height: 25,
    position: "absolute",
    right: 0,
    top: 0,
    padding: 5,
    fontFamily: "p-semibold",
    backgroundColor: "red",
  },
  loader: {
    marginTop: 100,
  },
  gameInfo: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginBottom: 4,
  },
  detailBtn: {
    padding: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#17628b34",
    borderWidth: 0,
    borderColor: "#17628b94",
    borderBottomWidth: 4,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
    marginBottom: 15,
  },
  tGame: {
    position: "absolute",
    top: 0,
    left: "41%",
    fontFamily: "p-semibold",
    backgroundColor: "#17628b34",
    fontSize: 11,
    borderRadius: 5,
    padding: 3,
    color: "#1f3a5c",
    paddingHorizontal: 10,
  },
});

export default QuarterFinals;
