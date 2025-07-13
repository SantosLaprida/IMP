import React, { useState } from "react";
import {
	ScrollView,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
} from "react-native";

export default function RulesOfPlay({ navigation }) {
	const [language, setLanguage] = useState("en"); // "en" o "es"

	const toggleLanguage = () => {
		setLanguage((prev) => (prev === "en" ? "es" : "en"));
	};

	const isEnglish = language === "en";

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.heading}>IMP Rules</Text>
				<TouchableOpacity onPress={toggleLanguage} style={styles.langButton}>
					<Text style={styles.langButtonText}>
						{isEnglish ? "Spanish" : "English"}
					</Text>
				</TouchableOpacity>
			</View>

			{isEnglish ? (
				<>
					<Text style={styles.subheading}>How to Participate</Text>
					<Text style={styles.paragraph}>
						To participate, you must select 12 players from the tournament's
						official list.{"\n\n"}
						Selections can be made on Monday, Tuesday, and Wednesday.{"\n\n"}
						During this period, your selection can be modified as many times as
						you wish.{"\n\n"}
						On Thursday, during the first round of the tournament, an 18-hole
						medal play qualifier is played.{"\n\n"}
						At the end of the day, the top 8 players on the official leaderboard
						will qualify for the match play tournament.{"\n\n"}
						There is no automatic tiebreaker in case of a tie.
					</Text>

					<Text style={styles.subheading}>How to Qualify</Text>
					<Text style={styles.paragraph}>
						To qualify, at least one of your 12 selected players must be among
						the top 8 on the leaderboard.{"\n\n"}
						Based on their ranking, your player will be placed in the draw.
						{"\n\n"}
						If none of your selected players are in the top 8, you will be
						eliminated from the competition.
					</Text>

					<Text style={styles.subheading}>The Matches</Text>
					<Text style={styles.paragraph}>
						On Friday, the quarterfinals are played using the traditional match
						play draw format.{"\n\n"}
						Each match progresses as the players complete their rounds, and the
						app compares the holes already played to update the live or final
						match result.{"\n\n"}
						In the event of a tie, the match returns to hole 1, and the first
						player to win a hole is declared the winner.{"\n\n"}
						If the tie persists because both scorecards are identical, the
						higher-seeded player will be considered the winner.{"\n\n"}
						If a qualified player is unable to play on Friday for any reason, it
						will be considered a walkover (WO) for their opponent — the same
						applies for Saturday and Sunday matches.
					</Text>
				</>
			) : (
				<>
					<Text style={styles.subheading}>Cómo Participar</Text>
					<Text style={styles.paragraph}>
						Para participar, se deben elegir 12 jugadores de la lista oficial
						del torneo.{"\n\n"}
						Las selecciones pueden hacerse lunes, martes y miércoles.{"\n\n"}
						Durante ese periodo, se pueden modificar todas las veces que se
						desee.{"\n\n"}
						El jueves, durante la primera ronda del torneo, se juega una
						clasificación a 18 hoyos medal play.{"\n\n"}
						Al final del día, los 8 primeros jugadores del leaderboard oficial
						clasificarán al torneo de match play.{"\n\n"}
						No hay desempate automático en caso de empate.
					</Text>

					<Text style={styles.subheading}>Cómo Clasificar</Text>
					<Text style={styles.paragraph}>
						Para clasificar, al menos uno de los 12 jugadores seleccionados debe
						estar entre los 8 primeros del leaderboard.{"\n\n"}
						Según su orden de clasificación, será ubicado en el draw.{"\n\n"}
						Si ninguno de tus jugadores está entre los 8 primeros, quedarás
						fuera de la competencia.
					</Text>

					<Text style={styles.subheading}>Los Partidos</Text>
					<Text style={styles.paragraph}>
						El viernes se juegan los cuartos de final con el formato clásico de
						match play.{"\n\n"}
						Cada partido avanza a medida que los jugadores completan sus rondas,
						y la app compara los hoyos ya jugados para mostrar el resultado
						parcial o final.{"\n\n"}
						En caso de empate, se vuelve al hoyo 1 y el primer jugador que gane
						un hoyo será el ganador.{"\n\n"}
						Si persiste el empate porque las tarjetas son idénticas, gana el
						jugador mejor clasificado.{"\n\n"}
						Si un jugador clasificado no puede jugar el viernes por cualquier
						motivo, se considera WO a favor del rival — lo mismo aplica para
						sábado y domingo.
					</Text>
				</>
			)}
			<View style={styles.backButtonContainer}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => navigation.goBack()}
				>
					<Text style={styles.backButtonText}>Back</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: "white",
		flex: 1,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	heading: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#1f3a5c",
	},
	langButton: {
		backgroundColor: "#1f3a5c",
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 6,
	},
	langButtonText: {
		color: "white",
		fontWeight: "600",
	},
	subheading: {
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 20,
		marginBottom: 10,
		color: "#1f3a5c",
	},
	paragraph: {
		fontSize: 15,
		lineHeight: 22,
		color: "#333",
	},
	backButtonContainer: {
		alignItems: "center",
		marginBottom: 45,
	},

	backButton: {
		backgroundColor: "#1f3a5c",
		padding: 6,
		margin: 5,
		marginTop: 30,
		borderRadius: 10,
		width: 300,
		alignItems: "center",
		borderWidth: 0,
		borderColor: "#17628b94",
		borderBottomWidth: 7,
		borderBottomColor: "rgba(0, 0, 0, 0.2)",
	},

	backButtonText: {
		color: "white",
		fontSize: 14,
		fontFamily: "p-semibold",
		position: "relative",
		bottom: -2,
	},
});
