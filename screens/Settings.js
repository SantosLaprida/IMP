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

const Settings = ({ navigation }) => {
	const [user, setUser] = useState(null);

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
						<TouchableOpacity style={styles.buttonContainer}>
							<View style={styles.button}>
								<Ionicons name="people" size={28} color="#1f3a5c" />
							</View>
							<Text style={styles.buttonText}>About us</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.buttonContainer}>
							<View style={styles.button}>
								<Entypo name="help-with-circle" size={28} color="#1f3a5c" />
							</View>
							<Text style={styles.buttonText}>Support</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.content}>
						<TouchableOpacity style={styles.buttonContainer}>
							<View style={styles.button}>
								<FontAwesome name="book" size={28} color="#1f3a5c" />
							</View>
							<Text style={styles.buttonText}>Rules of play</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.buttonContainer}>
							<View style={styles.button}>
								<MaterialCommunityIcons
									name="account-circle"
									size={35}
									color="#1f3a5c"
								/>
							</View>
							<Text style={styles.buttonText}>Account</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
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
});

export default Settings;
