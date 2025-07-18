import { storeTeam, fetchTeam } from "../server/firestore/teams";
import { fetchPlayersFromFirestore } from "../server/firestore/players";
import {
	fetchTournament,
	getNumberPlayersBet,
} from "../server/firestore/tournaments";
import { getMinimumClassification } from "../server/firestoreFunctions";
import { updateBetCount } from "../server/firestore/players";
import { userMadeBet, deleteBet } from "../server/firestore/bets";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../server/config/firebaseConfig";
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
	const [ordenado, setOrdenado] = useState(false);
	const [loadingSubmit, setLoadingSubmit] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const tournamentId = await getTournamentId();
				const data = await fetchPlayersFromFirestore(tournamentId);
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

					const userTeam = await fetchTeam(tournamentId, userId);

					if (userTeam) {
						const teamArray = Object.values(userTeam);

						const mappedTeam = teamArray
							.map((idPlayer) => {
								return data.find((player) => player.idPlayer === idPlayer);
							})
							.filter((player) => player); // Filtrar resultados undefined

						setEquipo(mappedTeam);

						// Remover jugadores del equipo de la lista de jugadores disponibles
						setJugadores((prevJugadores) =>
							prevJugadores.filter(
								(jugador) =>
									!mappedTeam.some(
										(player) => player.idPlayer === jugador.idPlayer
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
			return tournament[0].id;
		} catch (error) {
			console.error("Error fetching tournament data:", error);
			throw error;
		}
	};
	const ordenarPorRank = () => {
		if (ordenado) {
			setJugadores(originalJugadores);
		} else {
			const jugadoresOrdenados = [...jugadores].sort((a, b) => {
				// Si `a.rank` es 0, lo mueve al final
				if (a.rank === 0) return 1;
				// Si `b.rank` es 0, lo mueve al final
				if (b.rank === 0) return -1;
				// Orden normal de menor a mayor
				return a.rank - b.rank;
			});
			setJugadores(jugadoresOrdenados);
		}
		setOrdenado(!ordenado);
	};

	const agregarJugadorAlEquipo = (jugador, limit) => {
		if (equipo.length >= limit) {
			alert(`You can only select a maximum of ${limit} players`);
			return;
		}
		setEquipo((prevEquipo) => [...prevEquipo, jugador]);
		setJugadores((prevJugadores) =>
			prevJugadores.filter((j) => j.idPlayer !== jugador.idPlayer)
		);
	};
	const getButtonText = () => {
		if (hasBet) {
			return "Change my team";
		} else {
			return "Place my team";
		}
	};

	const quitarJugadorDelEquipo = (jugador) => {
		setEquipo((prevEquipo) =>
			prevEquipo.filter((j) => j.idPlayer !== jugador.idPlayer)
		);
		setJugadores((prevJugadores) => [...prevJugadores, jugador]);
	};

	const handleFinish = async () => {
		if (equipo.length < limit) {
			alert(`please select ${limit} players`);
			return;
		}

		setLoadingSubmit(true);

		const userId = await retrieveUser();
		const playersIds = equipo.map((jugador) => jugador.idPlayer);
		// const playerNames = equipo.map((jugador) => jugador.name);

		try {
			const tournamentId = await getTournamentId();
			let oldPlayerIds = [];
			if (hasBet) {
				const oldTeam = await fetchTeam(tournamentId, userId);
				if (oldTeam) {
					oldPlayerIds = Object.values(oldTeam);
					await deleteBet(tournamentId, oldPlayerIds, userId);
				}
			}
			await Promise.all([
				storeTeam(userId, playersIds, tournamentId),
				updateBetCount(tournamentId, playersIds),
			]);
			console.log("Team stored successfully");
			alert("Bet placed succesfully");
			navigation.navigate("Bets", { team: equipo });
		} catch (error) {
			console.error("Failed to store team:", error);
		}

		await AsyncStorage.setItem("equipo", JSON.stringify(equipo));
		setEquipo([]);
		setJugadores(originalJugadores);
		setLoadingSubmit(false);
	};

	const handleDelete = async () => {
		if (!hasBet) {
			alert("You don't have a team to delete");
			return;
		}

		setLoadingSubmit(true);

		// const playerNames = equipo.map((jugador) => jugador.name);
		const playerIds = equipo.map((jugador) => jugador.idPlayer);

		const userId = await retrieveUser();

		try {
			const tournamentId = await getTournamentId();
			await deleteBet(tournamentId, playerIds, userId);
			alert("Team deleted succesfully");
			setEquipo([]);
			setJugadores(originalJugadores);
			setLoadingSubmit(false);
			navigation.navigate("Bets", { team: [] });
		} catch (error) {
			console.error("Failed to delete bet");
		}
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

	const teamPlayerIds = new Set(equipo.map((player) => player.idPlayer));

	const filteredJugadores = jugadores.filter(
		(jugador) =>
			!teamPlayerIds.has(jugador.idPlayer) &&
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
						{limit ? `Choose ${limit} players` : "Choose your team"}
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
							style={{ ...styles.scroll, marginBottom: 25 }}
							showsVerticalScrollIndicator={false}
						>
							{filteredJugadores.map((jugador) => (
								<TouchableOpacity
									key={jugador.idPlayer}
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
					<TouchableOpacity
						style={{
							...styles.button,
							backgroundColor: "#1f3a5c",
							padding: 2,
							width: 120,
							right: 0,
							position: "absolute",
							bottom: 0,
						}}
						onPress={ordenarPorRank}
					>
						<Text style={{ ...styles.buttonText, color: "white" }}>
							Sort by Rank
						</Text>
					</TouchableOpacity>
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
								key={jugador.idPlayer}
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
						disabled={loadingSubmit}
					>
						{loadingSubmit ? (
							<ActivityIndicator color="#fff" />
						) : (
							<Text style={{ ...styles.buttonText, color: "white" }}>
								{getButtonText()}
							</Text>
						)}
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleDelete}
						style={{ ...styles.button, backgroundColor: "red" }}
						disabled={loadingSubmit}
					>
						{loadingSubmit ? (
							<ActivityIndicator color="#fff" />
						) : (
							<Text style={{ ...styles.buttonText, color: "white" }}>
								Delete Team
							</Text>
						)}
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
		height: 340,
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
