import {
	collection,
	deleteDoc,
	updateDoc,
	getDocs,
	query,
	where,
	doc,
	setDoc,
	getDoc,
	addDoc,
	getFirestore,
} from "firebase/firestore";

import { firestore } from "../config/firebaseConfig";

export const fetchTournament = async () => {
	const currentYear = new Date().getFullYear().toString();
	try {
		const q = query(
			collection(firestore, "I_Torneos", currentYear, "Tournaments"),
			where("activo", "==", 1)
		);
		const querySnapshot = await getDocs(q);
		const activeTournamentsData = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return activeTournamentsData;
	} catch (error) {
		console.error("Error fetching active tournament:", error);
		throw error;
	}
};

export const fetchQualifiers = async (TournamentId, collectionName) => {
	const currentYear = new Date().getFullYear().toString();
	try {
		const querySnapshot = await getDocs(
			collection(
				firestore,
				"I_Torneos",
				currentYear,
				"Tournaments",
				TournamentId,
				collectionName
			)
		);
		const sortedPlayerData = querySnapshot.docs
			.map((doc) => ({
				id_player: doc.data().playerId,
				name: doc.data().name,
				order: doc.data().order,
			}))
			.sort((a, b) => a.order - b.order);

		return sortedPlayerData.filter(({ name }) => name !== null);
	} catch (error) {
		console.error("Error fetching qualifiers:", error);
		throw error;
	}
};

export const fetchThirdPlaceQualifiers = async (tournamentName) => {
	const currentYear = new Date().getFullYear().toString();
	try {
		const querySnapshot = await getDocs(
			collection(
				firestore,
				"I_Torneos",
				currentYear,
				"Tournaments",
				tournamentName,
				"I_TercerCuarto"
			)
		);
		const sortedPlayerData = querySnapshot.docs
			.map((doc) => ({
				id_player: doc.data().id_player,
				name: doc.data().name,
				orden: doc.data().orden,
			}))
			.sort((a, b) => a.orden - b.orden);

		return sortedPlayerData.filter(({ name }) => name !== null);
	} catch (error) {
		console.error("Error fetching qualifiers:", error);
		throw error;
	}
};

export const getActiveBracket = async (tournamentId) => {
	const currentYear = new Date().getFullYear().toString();

	try {
		const docRef = doc(
			firestore,
			"I_Torneos",
			currentYear,
			"Tournaments",
			tournamentId
		);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) return null;

		const data = docSnap.data();

		const rounds = ["round1", "round2", "round3", "round4"];
		const statuses = rounds.map((round) => data[round]);

		if (statuses.every((status) => status === "Not Started")) {
			return "not_started";
		}

		if (statuses.every((status) => status === "Complete")) {
			return "complete";
		}

		for (const round of rounds) {
			if (data[round] === "In Progress") {
				return round;
			}
		}

		for (let i = rounds.length - 1; i >= 0; i--) {
			if (data[rounds[i]] === "Complete") {
				return rounds[i];
			}
		}

		return null;
	} catch (error) {
		console.error("Error determining active bracket:", error);
		throw error;
	}
};


export const isBracketActive = async (tournamentId, collectionName) => {
	const currentYear = new Date().getFullYear().toString();
	try {
		const bracketRef = collection(
			firestore,
			"I_Torneos",
			currentYear,
			"Tournaments",
			tournamentId,
			collectionName
		);
		const querySnapshot = await getDocs(bracketRef);
		let isActive = true;

		querySnapshot.forEach((doc) => {
			const data = doc.data();
			if (!data.name || data.name.trim() === "") {
				isActive = false;
			}
		});

		return isActive;
	} catch (error) {
		console.error("Error checking bracket:", error);
		throw error;
	}
};

export const getApuestas = async (tournamentId) => {
	const currentYear = new Date().getFullYear().toString();
	try {
		// Reference to the specific tournament document
		const tournamentDocRef = doc(
			firestore,
			"I_Torneos",
			currentYear,
			"Tournaments",
			tournamentId
		);

		// Fetch the document
		const tournamentDocSnap = await getDoc(tournamentDocRef);

		// Check if the document exists and contains the 'apuestas' field
		if (tournamentDocSnap.exists()) {
			const data = tournamentDocSnap.data();
			return data.apuestas || null; // Return the 'apuestas' field if it exists, otherwise null
		} else {
			console.log("Tournament document does not exist.");
			return null;
		}
	} catch (error) {
		console.error("Error getting apuestas:", error);
		throw error;
	}
};

export const getNumberPlayersBet = async (tournamentId) => {
	const currentYear = new Date().getFullYear().toString();
	try {
		const docRef = doc(
			firestore,
			"I_Torneos",
			currentYear,
			"Tournaments",
			tournamentId
		);
		const docSnapshot = await getDoc(docRef);

		if (docSnapshot.exists()) {
			const data = docSnapshot.data();
			return data.minimoApuestas || null;
		} else {
			console.error("No such document!");
			return null;
		}
	} catch (error) {
		console.error("Error fetching limit:", error);
		throw error;
	}
};

