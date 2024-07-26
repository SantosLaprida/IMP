import {
	fetchQuarterQualifiers,
	fetchTournament,
} from "../server/firestoreFunctions";
import React, { useState, useEffect } from "react";
import { compareScores, showResults } from "./QuarterUtils";

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
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { reload } from "firebase/auth";

const Games = ({ navigation }) => {
	const [ids, setIds] = useState(Array(8).fill(null)); // Marcar posición con null
	const [results1, setResults1] = useState(null);
	const [results2, setResults2] = useState(null);
	const [results3, setResults3] = useState(null);
	const [results4, setResults4] = useState(null);
	const [names, setNames] = useState(Array(8).fill("Loading..."));
	const [loading, setLoading] = useState(true);

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

	const fetchQualifiers = async () => {
		setLoading(true);
		try {
			const tournamentId = await getTournamentName();
			const qualifiers = await fetchQuarterQualifiers(tournamentId);
			const names = qualifiers.map((qualifier) => qualifier.name);
			const ids = qualifiers.map((qualifier) => qualifier.id_player);
			setNames(names);
			setIds(ids);
			await compareMatches(ids);
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	const getTournamentName = async () => {
		try {
			const tournament = await fetchTournament();
			return tournament[0].id;
		} catch (error) {
			console.error("Error fetching tournament data:", error);
			throw error;
		}
	};

	const compareMatches = async (ids) => {
		await Promise.all([
			compareFirstMatch(ids),
			compareSecondMatch(ids),
			compareThirdMatch(ids),
			compareFourthMatch(ids),
		]);
	};

	const compareFirstMatch = async (ids) => {
		try {
			if (ids[0] === null || ids[7] === null) {
				console.error("Invalid player IDs for first match:", ids[0], ids[7]);
				return;
			}
			const collectionName = "I_Cuartos";
			const tournamentId = await getTournamentName();
			const results = await compareScores(
				ids[0],
				ids[7],
				tournamentId,
				collectionName
			);
			setResults1(results);
		} catch (error) {
			console.error(error);
		}
	};

	const compareSecondMatch = async (ids) => {
		try {
			if (ids[1] === null || ids[6] === null) {
				console.error("Invalid player IDs for second match:", ids[1], ids[6]);
				return;
			}
			const collectionName = "I_Cuartos";
			const tournamentId = await getTournamentName();
			const results = await compareScores(
				ids[1],
				ids[6],
				tournamentId,
				collectionName
			);
			setResults2(results);
		} catch (error) {
			console.error(error);
		}
	};

	const compareThirdMatch = async (ids) => {
		try {
			if (ids[2] === null || ids[5] === null) {
				console.error("Invalid player IDs for third match:", ids[2], ids[5]);
				return;
			}
			const collectionName = "I_Cuartos";
			const tournamentId = await getTournamentName();
			const results = await compareScores(
				ids[2],
				ids[5],
				tournamentId,
				collectionName
			);
			setResults3(results);
		} catch (error) {
			console.error(error);
		}
	};

	const compareFourthMatch = async (ids) => {
		try {
			if (ids[3] === null || ids[4] === null) {
				console.error("Invalid player IDs for fourth match:", ids[3], ids[4]);
				return;
			}
			const collectionName = "I_Cuartos";
			const tournamentId = await getTournamentName();
			const results = await compareScores(
				ids[3],
				ids[4],
				tournamentId,
				collectionName
			);
			setResults4(results);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchQualifiers();
	}, []);

	const displayResults = (results, name1, name2) => {
		if (!results) {
			return "Loading...";
		}
		return showResults(results, name1, name2);
	};

	const displayResultsLeft = (results) => {
		if (!results) {
			return null;
		}
		if (!results.stillPlaying) {
			return null;
		}
		if (results.result < 0) {
			return -1 * results.result + "-UP";
		}
		return null;
	};

	const displayResultsRight = (results) => {
		if (!results) {
			return null;
		}
		if (!results.stillPlaying) {
			return null;
		}
		if (results.result > 0) {
			return results.result + "-UP";
		}
		return null;
	};

	const displayMiddle = (results, name1, name2) => {
		if (!results) {
			return "Loading...";
		}
		if (results.stillPlaying) {
			return "Thru " + results.holesPlayed;
		}
		if (results.result > 0) {
			return name2 + " Won";
		}
		if (results.result < 0) {
			return name1 + " Won";
		}
	};

	const results = {
		stillPlaying: true,
		result: -5,
	};

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
					Quarter Finals
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
								<Text style={styles.tGame}>Game 1</Text>
								<Text
									style={[
										styles.text_left,
										{
											backgroundColor: displayResultsLeft(results1)
												? "red"
												: "transparent",
										},
									]}
								>
									{displayResultsLeft(results1)}
								</Text>
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
								<View style={styles.middle}>
									<Text style={{ ...styles.text, fontSize: 14 }}>
										{displayMiddle(results1, names[0], names[7])}
									</Text>
								</View>
								<Text
									style={[
										styles.text_right,
										{
											backgroundColor: displayResultsRight(results1)
												? "red"
												: "transparent",
										},
									]}
								>
									{displayResultsRight(results1)}
								</Text>
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
										{names[7]}
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
								<Text style={styles.tGame}>Game 2</Text>
								<Text
									style={[
										styles.text_left,
										{
											backgroundColor: displayResultsLeft(results4)
												? "red"
												: "transparent",
										},
									]}
								>
									{displayResultsLeft(results4)}
								</Text>
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
								<View style={styles.middle}>
									<Text style={{ ...styles.text, fontSize: 14 }}>
										{displayMiddle(results4, names[3], names[4])}
									</Text>
								</View>
								<Text
									style={[
										styles.text_right,
										{
											backgroundColor: displayResultsRight(results4)
												? "red"
												: "transparent",
										},
									]}
								>
									{displayResultsRight(results4)}
								</Text>

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
										{names[4]}
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
								<Text style={styles.tGame}>Game 3</Text>
								<Text
									style={[
										styles.text_left,
										{
											backgroundColor: displayResultsLeft(results3)
												? "red"
												: "transparent",
										},
									]}
								>
									{displayResultsLeft(results3)}
								</Text>
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
								<View style={styles.middle}>
									<Text style={{ ...styles.text, fontSize: 14 }}>
										{displayMiddle(results3, names[2], names[5])}
									</Text>
								</View>
								<Text
									style={[
										styles.text_right,
										{
											backgroundColor: displayResultsRight(results3)
												? "red"
												: "transparent",
										},
									]}
								>
									{displayResultsRight(results3)}
								</Text>
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
										{names[5]}
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
								<Text style={styles.tGame}>Game 4</Text>
								<Text
									style={[
										styles.text_left,
										{
											backgroundColor: displayResultsLeft(results2)
												? "red"
												: "transparent",
										},
									]}
								>
									{displayResultsLeft(results2)}
								</Text>
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
								<View style={styles.middle}>
									<Text style={{ ...styles.text, fontSize: 14 }}>
										{displayMiddle(results2, names[1], names[6])}
									</Text>
								</View>
								<Text
									style={[
										styles.text_right,
										{
											backgroundColor: displayResultsRight(results2)
												? "red"
												: "transparent",
										},
									]}
								>
									{displayResultsRight(results2)}
								</Text>
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
										{names[6]}
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
				onPress={() => navigation.navigate("Bets")}
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

		width: "100%",
		alignItems: "center",
		padding: 5,
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
		left: "41%",
		fontFamily: "p-semibold",
		backgroundColor: "#17628b34",
		fontSize: 11,
		borderRadius: 5,
		padding: 3,
		paddingHorizontal: 10,
		color: "white",
	},
});

export default Games;
