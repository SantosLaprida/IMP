import { fetchTournament } from "../server/firestore/tournaments";

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

const Tournaments = ({ navigation }) => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [logo, setLogo] = useState(null);
  const [name, setName] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const handleGameMode = () => {
    setModalVisible(true);
  };

  const handleNavigate = (screen) => {
    setModalVisible(false);
    navigation.navigate(screen);
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

  return (
    <LinearGradient
      colors={["#17628b34", "white"]}
      locations={[0, 15]}
      style={styles.container}
    >
      <View style={{ ...styles.box, marginTop: -20 }}>
        <Text style={{ ...styles.text, fontSize: 20, paddingBottom: 50 }}>
          Upcoming Tournaments
        </Text>
        <Image
          source={require("../assets/images/IMP-02.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.box}>
        <Text style={{ ...styles.text, paddingBottom: 50, fontSize: 20 }}>
          Recent Tournaments
        </Text>
        <Image
          source={require("../assets/images/IMP-02.png")}
          style={styles.logo}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  box: {
    padding: 20,
    alignItems: "center",
    borderRadius: 20,
    justifyContent: "center",
    width: 350,
    marginTop: 30,
    backgroundColor: "rgb(255, 252, 241)",
    shadowColor: "#000", // Color de la sombra
    shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 6, // Radio de la sombra
    // Para Android
    height: 300,
    elevation: 10, // Elevación para la sombra
  },
  logo: {
    width: 150,
    height: 120,
    borderRadius: 20,
    backgroundColor: "black",
    padding: 5,
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
    backgroundColor: "rgba(0, 0, 0, 0.849)",
  },
  modalView: {
    width: 300,
    backgroundColor: "rgb(255, 252, 241)",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center",
    color: "#1f3a5c",
    fontWeight: "500",
  },
  modalButton: {
    backgroundColor: "#17628b34",
    padding: 7,
    margin: 5,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#17628b94",
    borderBottomWidth: 7,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
  },
  modalT: {
    color: "#1f3a5c",
    fontSize: 17,
    fontWeight: "600",
  },
  modalTDisabled: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
    textDecorationLine: "line-through",
  },
  modalButtonDisabled: {
    backgroundColor: "grey",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
    borderColor: "#17628b94",
    borderBottomWidth: 7,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
  },
  text: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1f3a5c",
    fontFamily: "Roboto",
  },
  button: {
    backgroundColor: "#17628b34",
    padding: 7,
    margin: 5,
    borderRadius: 10,
    width: 230,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#17628b94",
    borderBottomWidth: 7,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
  },
  buttonText: {
    color: "#1f3a5c",
    fontSize: 17,
    fontWeight: "600",
  },
  betBtn: {
    backgroundColor: "#1f3a5c",
    padding: 12,
    margin: 5,
    borderRadius: 10,
    width: 300,
    borderColor: "#1f3a5c",
    borderWidth: 2, // Elevación para la sombra
    justifyContent: "center",
  },
  betText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1.5,
    marginHorizontal: 25,
  },
  editIcon: {
    position: "absolute",
    right: 0,
    marginHorizontal: 15,
  },
});

export default Tournaments;
