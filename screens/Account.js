import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { auth } from "../server/config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import {
  logoutUser,
  deleteAccount,
  checkNotifiactionToggle,
  updateEmailNotificationPreference,
} from "../server/auth/authFunctions";

const Account = ({ navigation }) => {
  const [emailNotifications, setEmailNotifications] = useState(false);

  useEffect(() => {
    const loadEmailPreference = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const toggle = await checkNotifiactionToggle(userId);
          setEmailNotifications(toggle);
        }
      } catch (error) {
        console.error("Error loading email preference:", error);
      }
    };

    loadEmailPreference();
  }, []);

  const handleEmailToggle = async () => {
    try {
      const newValue = !emailNotifications;

      if (newValue === emailNotifications) return; // No actual change

      setEmailNotifications(newValue);

      const user = auth.currentUser;
      if (user) {
        await updateEmailNotificationPreference(user.uid, newValue);
      }
    } catch (error) {
      console.error("Error updating email preference:", error);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteAccount();
            navigation.navigate("Login");
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    await logoutUser();
    navigation.navigate("Login");
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Account Settings</Text>
        {/* <View style={styles.settingItem}>
        </View> */}
        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Log out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={[styles.backButton, styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: "white",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f3a5c",
    marginBottom: 24,
    textAlign: "center",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 20,
    backgroundColor: "#1f3a5c",
    padding: 16,
    borderRadius: 12,
    height: 50,
  },
  label: {
    //flex: 1,
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 15,
  },
  toggleButton: {
    width: 40,
    height: 25,
    borderRadius: 14,
    backgroundColor: "#ccc",
    justifyContent: "center",
    padding: 2,
    marginHorizontal: 8,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 12,
    backgroundColor: "white",
  },
  toggleOn: {
    alignSelf: "flex-end",
    backgroundColor: "#4CAF50",
  },
  toggleOff: {
    alignSelf: "flex-start",
  },
  infoIcon: {
    height: 28,
    width: 30,
    padding: 1,
  },
  actionButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  logoutButton: {
    display: "flex",
    justifyContent: "center",
    height: 50,
    backgroundColor: "#1f3a5c",
  },
  deleteButton: {
    display: "flex",
    justifyContent: "center",
    height: 50,
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButtonContainer: {
    backgroundColor: "white",
  },
  backButton: {
    backgroundColor: "#1f3a5c",
    width: "70%",
    marginBottom: 70,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "p-semibold",
  },
});

export default Account;
