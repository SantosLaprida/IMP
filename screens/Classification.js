import { getClasificationPlayers } from "../server/firestore/players";
import { fetchTournament } from "../server/firestore/tournaments";
import { fetchTeam } from "../server/firestore/teams";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../server/config/firebaseConfig";
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

const Classification = ({ navigation }) => {
	const [jugadores, setJugadores] = useState([]);
	const [equipo, setEquipo] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const tournamentId = await getTournamentId();
				const jugadores = await getClasificationPlayers(tournamentId);
				const user = auth.currentUser;
				let equipo = []
				if (user) {
					const userId = user.uid;
					const equipoData = await fetchTeam(tournamentId, userId);
					equipo = equipoData ? Object.values(equipoData) : [];
				}
				jugadores.sort((a, b) => a.order - b.order);
				setEquipo(equipo);
				setJugadores(jugadores);
				console.log(equipo);
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
			return tournament[0].id;
		} catch (error) {
			console.error("Error fetching tournament data:", error);
			throw error;
		}
	};

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
						Leaderboard
					</Text>

					<View style={styles.itemTitle}>
						<Text style={{ ...styles.text, width: "55%" }}>Player</Text>
						<Text style={styles.text}>N°</Text>
						<Text style={styles.text}>score</Text>
					</View>
					{loading ? (
						<ActivityIndicator
							style={styles.loader}
							size="large"
							color="#1f3a5c"
						/>
					) : (
						<ScrollView
							style={{ ...styles.scroll, marginBottom: 25 }}
							showsVerticalScrollIndicator={false}
						>
							{jugadores.map((jugador) => {
							const isSelected = equipo.includes(jugador.playerId);
							return (
								<TouchableOpacity key={jugador.playerId}>
									<View
										style={{
											...styles.jugadorItem,
											backgroundColor: isSelected ? "#d4f0ff" : "#f0f0f0",
											flexDirection: "row",
											justifyContent: "space-between",
										}}
									>
										<Text style={{ ...styles.text, fontSize: 11, width: "50%" }}>
											{jugador.name}
										</Text>
										<Text style={{ ...styles.text, fontSize: 11 }}>{jugador.order}</Text>
										<Text style={{ ...styles.text, fontSize: 11 }}>{jugador.score}</Text>
									</View>
								</TouchableOpacity>
							);
						})}
						</ScrollView>
					)}
				</View>

				<TouchableOpacity
					style={styles.button}
					onPress={() => navigation.navigate("Home")}
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
		height: 650,
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

export default Classification;
