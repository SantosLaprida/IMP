import { fetchTeam } from "../server/firestore/teams";
import {
	fetchTournament,
	getActiveBracket,
	getApuestas,
} from "../server/firestore/tournaments";
import {
	fetchPlayersFromFirestore,
	updateBetCount,
} from "../server/firestore/players";
import { userMadeBet } from "../server/firestore/bets";
import { getPlayerBets } from "../server/firestore/players";
import { auth } from "../server/config/firebaseConfig";

import React, { useEffect, useState, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	Modal,
	ScrollView,
	FlatList,
	Animated,
	ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Finals from "./Finals";

const Bets = ({ navigation, route }) => {
	const { team } = route.params || {};
	const [equipo, setEquipo] = useState([]);
	const [jugadores, setJugadores] = useState([]);
	const [originalJugadores, setOriginalJugadores] = useState([]);
	const [start, setStart] = useState(null);
	const [end, setEnd] = useState(null);
	const [logo, setLogo] = useState(null);
	const [tournamentId, setTournamentId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [name, setName] = useState(null);
	const [playerBets, setPlayerBets] = useState([]);

	const [modalVisible, setModalVisible] = useState(false);
	const [modalVisible1, setModalVisible1] = useState(false);
	const [modalBets, setModalBets] = useState(false);

	const [hasBet, setHasBet] = useState(false);
	const [activeBracketStage, setActiveBracketStage] = useState(null);
	const [canBet, setCanBet] = useState(true);
	const [loadingButton, setLoadingButton] = useState(false);
	const [loadingBetStatus, setLoadingBetStatus] = useState(true);

	useEffect(() => {
		if (Array.isArray(team)) {
			setEquipo(team);
		}
	}, [team]);

	useEffect(() => {
		const fetchTournamentId = async () => {
			try {
				const id = await getTournamentId();
				console.log("Fetched tournament ID:", id);
				setTournamentId(id);
			} catch (error) {
				console.error("Error fetching tournament ID:", error);
			}
		};

		fetchTournamentId();
	}, []);

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
		}, []);

		return <Animated.View style={[styles.dot, { opacity }]} />;
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!tournamentId) return;
				const data = await fetchPlayersFromFirestore(tournamentId);
				setJugadores(data);
				setOriginalJugadores(data);

				const user = auth.currentUser;
				if (user) {
					const userId = user.uid;

					const userTeam = await fetchTeam(tournamentId, userId);
					if (userTeam) {
						const teamArray = Object.values(userTeam);

						const mappedTeam = teamArray
							.map((playerId) => {
								return data.find((player) => player.idPlayer === playerId);
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
					} else {
						setEquipo([]);
					}
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [tournamentId]);

	useEffect(() => {
		const checkBetStatus = async () => {
			try {
				const tournamentId = await getTournamentId();
				const user = auth.currentUser;
				if (user) {
					const userId = user.uid;
					const betMade = await userMadeBet(tournamentId, userId);
					setHasBet(betMade);

					const canMakeBet = await getApuestas(tournamentId);
					setCanBet(canMakeBet);
				}
			} catch (error) {
				console.error("Error checking if user made bet:", error);
			} finally {
				setLoadingBetStatus(false);
			}
		};

		checkBetStatus();
		const interval = setInterval(checkBetStatus, 10000);
		return () => clearInterval(interval);
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

	const handleSeeBets = () => {
		setModalBets(true);
	};

	const handleGameMode = () => {
		setModalVisible(true);
	};
	const handleEditBet = () => {
		setModalVisible1(true);
	};

	const handleNavigate = (screen) => {
		setModalVisible(false);
		navigation.navigate(screen);
	};

	useEffect(() => {
		if (modalBets) {
			fetchPlayerBets();
		}
	}, [modalBets]);

	const fetchPlayerBets = async () => {
		setLoading(true);

		try {
			const tournamentId = await getTournamentId();
			const bets = await getPlayerBets(tournamentId);

			const sortedBets = bets.sort((a, b) => b.apuestas - a.apuestas);

			setPlayerBets(sortedBets);
		} catch (error) {
			console.error("Error fetching player bets:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleNavigation = (screen) => {
		setModalVisible1(false);
		navigation.navigate(screen);
	};

	const handleRouting = async (origin) => {
		let tournamentId = await getTournamentId();

		try {
			const activeBracket = await getActiveBracket(tournamentId);
			if (activeBracket === "round2") {
				navigation.navigate("QuarterFinals", { origin });
			} else if (activeBracket === "round3") {
				navigation.navigate("SemiFinals", { origin });
			} else if (activeBracket === "round4") {
				navigation.navigate("Finals", { origin });
			}
		} catch (error) {
			console.error("Error checking games:", error);
			setActiveBracketStage(null);
		}
	};

	const showText = () => {
		if (canBet && hasBet) {
			return "Manage bet";
		}
		if (hasBet && !canBet) {
			return "See your bet";
		} else {
			return "Participate";
		}
	};

	const checkGames = async () => {
		let tournamentId = await getTournamentId();
		try {
			const activeBracket = await getActiveBracket(tournamentId);
			setActiveBracketStage(activeBracket);
		} catch (error) {
			console.error("Error checking games:", error);
			setActiveBracketStage(null);
		}
	};

	useEffect(() => {
		checkGames();
		const intervalId = setInterval(() => {
			checkGames();
		}, 5000);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		const getTournamentData = async () => {
			try {
				const torneo = await fetchTournament();

				let name = torneo[0].name;
				let start_date = formatDate(torneo[0].start_date);
				let finish_date = formatDate(torneo[0].finish_date);
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

	const formatDate = (timestamp) => {
		const date = timestamp.toDate(); // Convertir a objeto Date
		return date.toLocaleDateString("es-ES"); // Formato dd/mm/yyyy
	};

	return (
		<LinearGradient
			colors={["#17628b34", "white"]}
			locations={[0, 15]}
			style={styles.container}
		>
			<View
				style={{
					width: "100%",
					backgroundColor: "white",
					height: 70,
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				<Image
					source={require("../assets/images/IMP-02.png")}
					style={{ ...styles.impLogo, marginHorizontal: 25, marginTop: 10 }}
				/>
				<Text
					style={{
						...styles.text,
						fontSize: 10,
						fontFamily: "p-bold",
						paddingHorizontal: 5,
						marginLeft: "auto",
						marginTop: 10,
					}}
				>
					Name, LastName
				</Text>
				<MaterialIcons
					style={{ marginRight: 15, position: "relative", bottom: -3.5 }}
					name="account-circle"
					size={30}
					color="#1f3a5c"
				/>
			</View>

			<View
				style={{
					...styles.box,
					flexDirection: "row",
					padding: 12,
					paddingTop: 5,
					flexWrap: "wrap",
					justifyContent: "space-around",
				}}
			>
				<TouchableOpacity style={styles.buttonContainer}>
					<View style={styles.button}>
						<Ionicons name="golf" size={20} color="#1f3a5c" />
					</View>
					<Text style={{ ...styles.buttonText, marginTop: -8 }}>Games</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.buttonContainer}>
					<View style={styles.button}>
						<Ionicons name="golf" size={20} color="#1f3a5c" />
					</View>
					<Text style={{ ...styles.buttonText, marginTop: -8 }}>
						Rules of Play
					</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.buttonContainer}>
					<View style={styles.button}>
						<Ionicons name="golf" size={20} color="#1f3a5c" />
					</View>
					<Text style={{ ...styles.buttonText, marginTop: -8 }}>
						Leaderboard
					</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.buttonContainer}>
					<View style={styles.button}>
						<Ionicons name="golf" size={20} color="#1f3a5c" />
					</View>
					<Text style={{ ...styles.buttonText, marginTop: -8 }}>
						Top Winners
					</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.buttonContainer}>
					<View style={styles.button}>
						<Ionicons name="golf" size={20} color="#1f3a5c" />
					</View>
					<Text style={{ ...styles.buttonText, marginTop: -8 }}>
						Bet History
					</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.buttonContainer}>
					<View style={styles.button}>
						<Ionicons name="golf" size={20} color="#1f3a5c" />
					</View>
					<Text style={{ ...styles.buttonText, marginTop: -8 }}>
						Highlights
					</Text>
				</TouchableOpacity>
			</View>

			<View style={{ ...styles.box, maxHeight: 480 }}>
				<View
					style={{
						width: "100%",
						backgroundColor: "#1f3a5c",
						borderTopRightRadius: 15,
						borderTopLeftRadius: 15,
					}}
				>
					<Text
						style={{
							...styles.text,
							fontSize: 12,
							padding: 7,
							color: "white",
							textAlign: "center",
						}}
					>
						Tournament of the week
					</Text>
				</View>
				<View
					style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}
				>
					<Image source={{ uri: logo }} style={{ ...styles.logo }} />
					<View style={{ marginHorizontal: 20 }}>
						<Text
							style={{
								...styles.text,
								fontSize: 15,
							}}
						>
							{name}
						</Text>

						<Text style={{ ...styles.text, fontSize: 10, marginTop: -5 }}>
							{"Starting date: " + start + " at 09:00 PM"}
						</Text>
					</View>
				</View>
				<View>
					{equipo.length > 1 ? (
						<ScrollView
							showsVerticalScrollIndicator={false}
							style={{ marginTop: 10 }}
						>
							<Text
								style={{
									...styles.text,
									fontSize: 12,
									textAlign: "center",
									marginBottom: 5,
								}}
							>
								Your players
							</Text>
							{equipo.map((jugador) => (
								<TouchableOpacity key={jugador.idPlayer}>
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
							<TouchableOpacity
								style={{ ...styles.btnClick }}
								onPress={async () => {
									setLoadingButton(true);

									try {
										if (canBet) {
											navigation.navigate("Players");
										} else {
											setModalVisible1(true);
										}
									} finally {
										setLoadingButton(false);
									}
								}}
								disabled={loadingButton}
							>
								{loadingButton || loadingBetStatus ? (
									<ActivityIndicator size="small" color="white" />
								) : (
									<Text style={styles.btnClickText}>{showText()}</Text>
								)}
							</TouchableOpacity>
						</ScrollView>
					) : (
						<Text
							style={{ ...styles.text, textAlign: "center", marginTop: 10 }}
						>
							No bet
						</Text>
					)}
				</View>
			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible1}
				onRequestClose={() => {
					setModalVisible1(!modalVisible1);
				}}
			>
				<View style={styles.modalContainer}>
					<View style={{ ...styles.box, height: 500 }}>
						<View style={styles.itemTitle}>
							<Text
								style={{
									...styles.text,
									textDecorationLine: "underline",
									fontSize: 16,
									marginBottom: 12,
								}}
							>
								Your players
							</Text>
						</View>
						{equipo.length > 1 ? (
							<ScrollView
								style={styles.scroll}
								showsVerticalScrollIndicator={false}
							>
								{equipo.map((jugador) => (
									<TouchableOpacity key={jugador.idPlayer}>
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
						) : (
							<Text
								style={{ ...styles.text, textAlign: "center", marginTop: 10 }}
							>
								No bet
							</Text>
						)}

						<TouchableOpacity
							onPress={() => setModalVisible1(false)}
							style={{
								...styles.modalButton,
								marginTop: 5,
								width: 250,
								backgroundColor: "#1f3a5c",
							}}
						>
							<Text style={{ ...styles.modalT, color: "white" }}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalBets}
				onRequestClose={() => {
					setModalBets(!modalBets);
				}}
			>
				<View style={styles.modalContainerBets}>
					<View style={{ ...styles.box, height: 650, width: 350 }}>
						<Text
							style={{
								...styles.text,
								textDecorationLine: "underline",
								fontSize: 16,
								marginBottom: 12,
							}}
						>
							Player Bets
						</Text>
						{loading ? (
							<Text>Loading...</Text>
						) : (
							<FlatList
								style={{ width: "80%", marginBottom: 5 }}
								data={playerBets}
								keyExtractor={(item) => item.name}
								renderItem={({ item }) => (
									<View style={styles.row}>
										<Text style={styles.cell}>{item.name}</Text>
										<Text style={styles.cell}>{item.apuestas}</Text>
									</View>
								)}
							/>
						)}
						<TouchableOpacity
							onPress={() => setModalBets(false)}
							style={{
								...styles.modalButton,
								marginTop: 15,
								width: 250,
								backgroundColor: "#1f3a5c",
							}}
						>
							<Text style={{ ...styles.modalT, color: "white" }}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	box: {
		alignItems: "center",
		borderRadius: 20,
		width: "90%",
		marginTop: 15,
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 10,
	},
	buttonContainer: {
		alignItems: "center",
		marginHorizontal: 7,
		backgroundColor: "white",
	},
	button: {
		backgroundColor: "transparent",
		marginHorizontal: 10,
		borderRadius: 50,
		width: 50,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 0,
		borderColor: "#17628b94",
		borderBottomColor: "rgba(0, 0, 0, 0.2)",
	},
	impLogo: {
		width: 50,
		height: 50,
		backgroundColor: "transparent",
	},
	logo: {
		width: 60,
		height: 60,
		borderRadius: 50,
		backgroundColor: "black",
		padding: 5,
	},

	miniBox: {
		backgroundColor: "rgb(255, 252, 241)",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 10,
		borderRadius: 10,
		borderWidth: 0,
		borderColor: "#17628b94",
		borderBottomWidth: 5,
		borderBottomColor: "rgba(0, 0, 0, 0.2)",
		paddingHorizontal: 30,
		padding: 10,
	},
	dot: {
		width: 12,
		height: 12,
		borderRadius: 12,
		backgroundColor: "red",
		marginLeft: 5,
		marginRight: -5,
		marginTop: 2,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
	},
	cell: {
		fontSize: 15,
	},

	container: {
		flex: 1,
		alignItems: "center",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.849)",
	},
	modalContainerBets: {
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
	btnClick: {
		backgroundColor: "#1f3a5c",
		padding: 5,
		marginTop: 7,
		borderRadius: 10,
		width: "100%",
		alignItems: "center",
		borderWidth: 0,
		borderColor: "#17628b94",
		borderBottomWidth: 7,
		borderBottomColor: "rgba(0, 0, 0, 0.2)",
	},
	btnClickText: {
		color: "white",
		fontSize: 14,
		fontFamily: "p-semibold",
		position: "relative",
		bottom: -2,
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
		fontFamily: "p-semibold",
		letterSpacing: 1.5,
		marginHorizontal: 25,
	},
	editIcon: {
		position: "absolute",
		right: 0,
		marginHorizontal: 15,
	},
	order: {
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "space-between",
	},
	btnDot: {
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
	},
	content: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 0,
	},

	buttonText: {
		color: "#1f3a5c",
		fontSize: 12,
		fontFamily: "p-semibold",
	},
	itemTitle: {
		borderRadius: 5,
		width: 250,
		marginVertical: 10,
		alignItems: "center",
		textDecorationLine: "underline",
	},
	jugadorItem: {
		padding: 5,
		paddingHorizontal: 10,
		marginBottom: 5,
		backgroundColor: "#f0f0f0",
		borderRadius: 5,
		width: 250,
	},
});

export default Bets;
