import React from "react";
import { useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	Image,
	StyleSheet,
	ScrollView,
} from "react-native";
import { fetchPlayers } from "../api";

const TournamentDetails = ({ route }) => {
	const [tournamentId, setTournamentId] = useState(null);
	const [jugadores, setJugadores] = useState([]);

	// Access the passed data from route.params
	const {
		name,
		start_date,
		end_date,
		logo,
		tournamentId: passedTournamentId,
	} = route.params;

	useEffect(() => {
		setTournamentId(passedTournamentId);
	}, [passedTournamentId]);

	useEffect(() => {
		if (tournamentId) {
			const getJugadores = async () => {
				try {
					const data = await fetchPlayers(tournamentId);
					setJugadores(data);
				} catch (error) {
					console.error("Error fetching players:", error);
				}
			};

			getJugadores();
		}
	}, [tournamentId]);

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.topCont}>
				<View style={styles.logoBox}>
					<Image source={{ uri: logo }} style={styles.logo} />
				</View>

				<Text style={styles.title}>{name}</Text>

				<Text style={styles.subtitle}>Start Date: {start_date}</Text>
				<Text style={styles.subtitle}>End Date: {end_date}</Text>
				<Text style={styles.subtitle}>
					Number of Players: {jugadores.length}
				</Text>
			</View>
			<Text style={{ ...styles.title, marginTop: 15 }}>Players</Text>
			<FlatList
				data={jugadores}
				keyExtractor={(item) => item.id_player}
				renderItem={({ item }) => (
					<View style={styles.playerItem}>
						<Text style={styles.playerName}>{item.name}</Text>
						<Text style={styles.playerRank}>Rank: {item.rank}</Text>
					</View>
				)}
			/>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#f8f8f8",
		alignItems: "center", // This moves everything inside the ScrollView to the center
	},
	logoBox: {
		marginBottom: 10,
		alignItems: "center",
	},
	logo: {
		width: 150,
		height: 100,
		borderRadius: 10,
		backgroundColor: "black",
		padding: 5,
		marginBottom: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
		textAlign: "center",
		color: "#1f3a5c",
	},
	subtitle: {
		fontSize: 16,
		marginBottom: 5,
		textAlign: "center",
		color: "#333",
	},
	playerItem: {
		marginBottom: 10,
		padding: 15,
		backgroundColor: "#fff",
		borderRadius: 5,
		width: "90%",
		alignSelf: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 5,
	},
	playerName: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1f3a5c",
	},
	playerRank: {
		fontSize: 14,
		color: "#666",
	},
	topCont: {
		height: "40%",
		padding: 20,
		alignItems: "center",
		borderRadius: 20,
		width: 350,
		marginTop: 15,
		backgroundColor: "rgb(255, 252, 241)",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 10,
	},
});

export default TournamentDetails;
