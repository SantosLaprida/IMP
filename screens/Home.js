import React, { useEffect, useState, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	Animated,
	Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import { fetchTournament } from "../server/firestoreFunctions";
import { getBracketAPI } from "../api";

const Home = ({ navigation }) => {
	const BlinkDot = () => {
		const opacity = useRef(new Animated.Value(1)).current;

		useEffect(() => {
			Animated.loop(
				Animated.sequence([
					Animated.timing(opacity, {
						toValue: 0,
						duration: 1000,
						useNativeDriver: true,
					}),
					Animated.timing(opacity, {
						toValue: 1,
						duration: 1000,
						useNativeDriver: true,
					}),
				])
			).start();
		}, [opacity]);

		return <Animated.View style={[styles.dot, { opacity }]} />;
	};

	const [modalVisible, setModalVisible] = useState(false);

	const handleBrackets = () => {
		setModalVisible(true);
	};

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

	const getTournamentId = async () => {
		const tournament = await fetchTournament();
		return tournament[0].id;
	};

	const handleRouting = (screen, origin) => {
		setModalVisible(false);
		navigation.navigate(screen, { origin });
	};

	const handleGames = async () => {
		const tournamentId = await getTournamentId();
		const bracket = await getBracketAPI(tournamentId);

		if (bracket) {
			if (bracket === "I_Cuartos") {
				navigation.navigate("QuarterFinals");
			} else if (bracket === "I_Semisfinales") {
				navigation.navigate("Bets");
			} else {
				navigation.navigate("Players");
			}
			navigation.navigate("Bracket", { bracket });
		} else {
			alert("Error fetching bracket");
		}
	};

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
							onPress={() => navigation.navigate("Tournaments")}
						>
							<View style={styles.button}>
								<FontAwesome5 name="trophy" size={26} color="#1f3a5c" />
							</View>
							<Text style={styles.buttonText}>Tournaments</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.buttonContainer}
							onPress={handleBrackets}
						>
							<View style={styles.button}>
								<Ionicons name="golf" size={28} color="#1f3a5c" />
							</View>
							<Text style={styles.buttonText}>Games</Text>
							<BlinkDot />
						</TouchableOpacity>
					</View>
					<View style={styles.content}>
						<TouchableOpacity
							style={styles.buttonContainer}
							onPress={() => navigation.navigate("Wallet")}
						>
							<View style={styles.button}>
								<FontAwesome5 name="wallet" size={28} color="#1f3a5c" />
							</View>
							<Text style={styles.buttonText}>Wallet</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.buttonContainer}
							onPress={() => navigation.navigate("Settings")}
						>
							<View style={styles.button}>
								<Ionicons name="settings" size={30} color="#1f3a5c" />
							</View>
							<Text style={styles.buttonText}>Settings</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalView}>
						<View style={styles.itemTitle}>
							<Text
								style={{
									...styles.text,
									textDecorationLine: "underline",
									fontSize: 16,
									marginBottom: 12,
								}}
							>
								Select bracket
							</Text>
						</View>
						<TouchableOpacity
							style={{
								...styles.modalButton,
								width: 200,
								backgroundColor: "#1f3a5c",
							}}
							onPress={() => handleRouting("QuarterFinals", "Home")}
						>
							<Text style={{ ...styles.modalT, color: "white" }}>
								Quarter finals
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{ ...styles.modalButtonDisabled, width: 200 }}
							onPress={() => handleRouting("SemiFinals", "Home")}
						>
							<Text style={styles.modalTDisabled}>Semi finals</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{ ...styles.modalButtonDisabled, width: 200 }}
							onPress={() => handleRouting("Finals", "Home")}
						>
							<Text style={styles.modalTDisabled}>Finals</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{ ...styles.modalButton, marginTop: 25, width: 250 }}
							onPress={() => setModalVisible(false)}
						>
							<Text style={styles.modalT}>Close</Text>
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
		fontFamily: "p-semibold",
	},
	modalButton: {
		backgroundColor: "#17628b34",
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
	modalT: {
		color: "#1f3a5c",
		fontSize: 14,
		fontFamily: "p-semibold",
		position: "relative",
		bottom: -2,
	},
	modalTDisabled: {
		color: "white",
		textDecorationLine: "line-through",
		fontSize: 14,
		fontFamily: "p-semibold",
		position: "relative",
		bottom: -2,
	},
	modalButtonDisabled: {
		backgroundColor: "grey",
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
	text: {
		fontSize: 15,
		color: "#1f3a5c",
		fontFamily: "p-semibold",
	},
});

export default Home;
