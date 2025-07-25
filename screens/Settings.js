import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

import { logoutUser, deleteAccount } from "../server/auth/authFunctions";

const Settings = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [supportModalVisible, setSupportModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [notifyToggle, setNotifyToggle] = useState(false);
  const [notificationInfoVisible, setNotificationInfoVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser !== null) {
        setUser(JSON.parse(storedUser));
      }
    };

    loadUser();
  }, []);

  return (
    <LinearGradient
      colors={["#17628b34", "white"]}
      locations={[0, 15]}
      style={styles.container}
    >
      <Image
        source={require("../assets/images/IMP-02.png")}
        style={styles.logo}
      />
      <View style={styles.row}>
        <View style={styles.rowContainer}>
          <View style={{ ...styles.content, marginTop: 10 }}>
            <TouchableOpacity
              style={styles.buttonContainer}
              // onPress={() => setModalVisible(true)}
            >
              <View style={styles.button}>
                <Ionicons name="people" size={28} color="#1f3a5c" />
              </View>
              <Text style={styles.buttonText}>About us</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => setSupportModalVisible(true)}
            >
              <View style={styles.button}>
                <Entypo name="help-with-circle" size={28} color="#1f3a5c" />
              </View>
              <Text style={styles.buttonText}>Support</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => navigation.navigate("RulesOfPlay")}
            >
              <View style={styles.button}>
                <FontAwesome name="book" size={28} color="#1f3a5c" />
              </View>
              <Text style={styles.buttonText}>Rules of play</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => setAccountModalVisible(true)}
            >
              <View style={styles.button}>
                <Ionicons name="person-circle" size={28} color="#1f3a5c" />
              </View>
              <Text style={styles.buttonText}>Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Who We Are</Text>
            <Text style={styles.modalText}>
              We are a passionate team of golf lovers and developers dedicated
              to bringing competitive excitement to every tournament. IMP is
              designed to make the game more interactive, social, and fun for
              everyone.
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={supportModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSupportModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Contact Us</Text>
            <Text style={styles.modalText}>carloslapridat@gmail.com</Text>
            <Text style={styles.modalText}>carlap2211@gmail.com</Text>
            <Text style={styles.modalText}>sslaprida95@gmail.com</Text>
            <TouchableOpacity
              onPress={() => setSupportModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={accountModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAccountModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Account Options</Text>

            {/* <TouchableOpacity
              style={[styles.modalActionButton, styles.editButton]}
              onPress={() => reportBugOrImprovement()}
              activeOpacity={0.7}
            >
              <Text style={styles.editButtonText}>
                {"Report a bug or improvement"}
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={[styles.modalActionButton, styles.editButton]}
              onPress={() => {
                setAccountModalVisible(false);
                logoutUser();
                navigation.navigate("Login");
              }}
            >
              <Text style={styles.editButtonText}>Log out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalActionButton, styles.deleteButton]}
              onPress={() => {
                setAccountModalVisible(false);
                deleteAccount();
                navigation.navigate("Login");
                console.log("Delete Account pressed");
              }}
            >
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAccountModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={notificationInfoVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setNotificationInfoVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <Text style={styles.modalText}>
              Turning notifications on will allow the app to send you important
              updates like tournament start alerts, bet confirmations, and
              results. You can always turn it off later.
            </Text>
            <TouchableOpacity
              onPress={() => setNotificationInfoVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  row: {
    backgroundColor: "rgb(255, 252, 241)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    padding: 20,
    paddingVertical: 20,
    borderRadius: 25,
    alignItems: "center",
    width: 350,
  },
  rowContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
    margin: 8,
    backgroundColor: "rgb(255, 252, 241)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    borderRadius: 15,
    padding: 10,
  },
  button: {
    backgroundColor: "#17628b34",
    padding: 10,
    margin: 5,
    marginHorizontal: 20,
    borderRadius: 50,
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
    borderColor: "#17628b94",
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
  },
  buttonText: {
    color: "#1f3a5c",
    fontSize: 12,
    fontFamily: "p-semibold",
  },
  logo: {
    width: 250,
    height: 150,
    marginBottom: 30,
  },
  btnDot: {
    position: "absolute",
    top: -10,
    right: -10,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 12,
    backgroundColor: "red",
    position: "absolute",
    right: 0,
    top: 0,
    margin: 8,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 340,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f3a5c",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  modalCloseButton: {
    backgroundColor: "#1f3a5c",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalCloseText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    padding: 3,
    paddingHorizontal: 15,
  },
  modalActionButton: {
    width: "90%",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  editButton: {
    backgroundColor: "#1f3a5c",
  },

  deleteButton: {
    backgroundColor: "#f44336",
  },

  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Settings;
