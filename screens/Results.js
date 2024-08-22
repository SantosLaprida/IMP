import { fetchQualifiers, fetchTournament } from "../server/firestoreFunctions";
import React, { useState, useEffect } from "react";
import { compareScores, showResults } from "./QuarterUtils";
import { fetchFinalResults } from "../server/finalsUtils/finalsUtils";

import {
	View,
	Text,
	StyleSheet,
	Image,
	ActivityIndicator,
	Button,
	TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { set } from "firebase/database";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { reload } from "firebase/auth";
import { useRoute } from "@react-navigation/native";

const Results = ({ navigation }) => {
	const route = useRoute();
	const { origin } = route.params;

	const handleNavigate = (origin) => {
		navigation.navigate(origin);
	};

	const [names, setNames] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getTournamentId = async () => {
			try {
				const tournament = await fetchTournament();
				return tournament[0].id;
			} catch (error) {
				console.error("Error fetching tournament data:", error);
				throw error;
			}
		};

		const fetchResults = async () => {
			try {
				const tournamentId = await getTournamentId();
				const names = await fetchFinalResults(tournamentId);
				setNames(names);
				setLoading(false);
			} catch (error) {
				console.error(error);
			}
		};

		fetchResults();
	}, []);

	const [start, setStart] = useState(null);
	const [end, setEnd] = useState(null);
	const [logo, setLogo] = useState(null);
	const [name, setName] = useState(null);

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
					Tournament Winners
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
								<Text style={styles.tGame}>1° Place</Text>
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
							</View>
							<TouchableOpacity style={styles.detailBtn}>
								<Text style={{ ...styles.text, fontSize: 12, marginTop: 3 }}>
									Details
								</Text>
							</TouchableOpacity>
							{/* GAME 2 */}
							<View style={styles.gameBox}>
								<Text style={styles.tGame}>2° Place</Text>

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
							</View>
							<TouchableOpacity style={styles.detailBtn}>
								<Text style={{ ...styles.text, fontSize: 12, marginTop: 3 }}>
									Details
								</Text>
							</TouchableOpacity>
							{/* GAME 3*/}
							<View style={styles.gameBox}>
								<Text style={styles.tGame}>3° Place</Text>

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
							</View>
							<TouchableOpacity style={styles.detailBtn}>
								<Text style={{ ...styles.text, fontSize: 12, marginTop: 3 }}>
									Details
								</Text>
							</TouchableOpacity>
							{/* GAME 4*/}
							<View style={styles.gameBox}>
								<Text style={styles.tGame}>4° Place</Text>

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
							</View>
							<TouchableOpacity style={styles.detailBtn}>
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
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
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
		paddingVertical: 15,
		width: "100%",
		alignItems: "center",
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
		width: "100%",
		fontFamily: "p-semibold",
		backgroundColor: "#17628b34",
		fontSize: 11,
		borderRadius: 5,
		padding: 3,
		color: "#1f3a5c",
		textAlign: "center",
	},
});

export default Results;
