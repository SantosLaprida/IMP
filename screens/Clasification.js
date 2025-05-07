import { fetchPlayersFromFirestore } from "../server/firestore/players";
import { fetchTournament } from "../server/firestore/tournaments";

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

const clasification = ({ navigation }) => {
	const [jugadores, setJugadores] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const tournamentId = await getTournamentId();
				const jugadores = await fetchPlayersFromFirestore(tournamentId);
				setJugadores[jugadores];
			} catch (error) {
				console.error("Error fetching data:", error);
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
};
