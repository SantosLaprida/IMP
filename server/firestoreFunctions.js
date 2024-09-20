// server/firestoreFunctions.js

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
import { auth, db } from "./firebaseConfig";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
} from "firebase/auth";

const firestore = getFirestore();

export const createTournament = async (
	tournamentId,
	name,
	start_date,
	finish_date,
	logo,
	players
) => {
	console.log(players);

	// if (!Array.isArray(players)) {
	//   throw new TypeError("The 'players' parameter must be an array");
	// }

	const tournamentRef = doc(firestore, "I_Torneos", tournamentId);
	await setDoc(tournamentRef, {
		activo: 1,
		start_date: start_date,
		finish_date: finish_date,
		logo: logo,
		name: name,
	});

	const collectionRef = collection(
		firestore,
		"I_Torneos",
		tournamentId,
		"I_Players"
	);

	for (const player of players) {
		if (player.name && player.rank !== undefined) {
			const docRef = doc(collectionRef, player.name);
			await setDoc(docRef, {
				id_player: generateAutoId(),
				name: player.name,
				rank: player.rank,
			});
		} else {
			console.error("Invalid player object", player);
		}
	}
};

export const createI_Players = async (tournamentId, players) => {
	if (!Array.isArray(players)) {
		throw new TypeError("The 'players' parameter must be an array");
	}

	const collectionRef = collection(
		firestore,
		"I_Torneos",
		tournamentId,
		"I_Players"
	);

	for (const player of players) {
		if (player.name && player.rank !== undefined) {
			const docRef = doc(collectionRef, player.name);
			await setDoc(docRef, {
				rank: player.rank,
				id_player: docRef.id,
			});
		} else {
			console.error("Invalid player object", player);
		}
	}
};

export const registerUser = async (email, password, firstName, lastName) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		console.log("User registered:", userCredential.user);

		// Store additional user data in Firestore
		const uid = userCredential.user.uid;
		const userRef = doc(firestore, "I_Members", uid);
		await setDoc(userRef, {
			email: email,
			firstName: firstName,
			lastName: lastName,
		});

		return userCredential.user;
	} catch (error) {
		console.error("Error registering user:", error.code, error.message);
		throw error;
	}
};

export const loginUser = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		console.log("User logged in:", userCredential.user);

		// Retrieve additional user data from Firestore if needed
		const uid = userCredential.user.uid;
		const userRef = doc(firestore, "I_Members", uid);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			console.log("User data:", userDoc.data());
			return { ...userCredential.user, ...userDoc.data() };
		} else {
			console.log("No such user document!");
			return userCredential.user;
		}
	} catch (error) {
		console.error("Error logging in user:", error.code, error.message);
		throw error;
	}
};

export const sendPasswordReset = async (email) => {
	try {
		await sendPasswordResetEmail(auth, email);
		console.log("Password reset email sent!");
	} catch (error) {
		console.error("Error sending password reset email:", error);
		throw error;
	}
};

export const fetchPlayers = async () => {
	try {
		const querySnapshot = await getDocs(collection(firestore, "I_Players"));
		const playersData = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		return playersData;
	} catch (error) {
		console.error("Error fetching players:", error);
		throw error;
	}
};

export const storeTeam = async (userId, team) => {
	try {
		const userRef = doc(firestore, "Teams", userId);
		await setDoc(userRef, { team });
		console.log("Team stored successfully");
	} catch (error) {
		console.error("Error storing team:", error);
		throw error;
	}
};

export const fetchPlayersFromFirestore = async (tournamentId) => {
	try {
		const querySnapshot = await getDocs(
			collection(firestore, "I_Torneos", tournamentId, "I_Players")
		);
		const playersData = querySnapshot.docs.map((doc) => {
			const data = doc.data(); // Get the data without adding the Firestore id
			return { id_player: doc.id, ...data }; // Use id_player as the primary identifier
		});
		console.log("returning playersData", playersData);
		return playersData;
	} catch (error) {
		console.error("Error fetching players:", error);
		throw error;
	}
};

export const storeTeamInFirestore = async (userId, team, tournamentId) => {
	try {
		const teamDocRef = doc(
			firestore,
			"I_Torneos",
			tournamentId,
			"I_Apuestas",
			userId // The document ID is the userId
		);

		// Create an object to store the players in the format { player1: playerId1, player2: playerId2, ... }
		const teamData = {};

		team.forEach((playerId, index) => {
			teamData[`player${index + 1}`] = playerId;
		});

		// Store the team data in Firestore
		await setDoc(teamDocRef, teamData);

		console.log("Team stored successfully");
	} catch (error) {
		console.error("Error storing team:", error);
		throw error;
	}
};
export const fetchTeamFromFirestore = async (tournamentId, userId) => {
	try {
		const teamDocRef = doc(
			firestore,
			"I_Torneos",
			tournamentId,
			"I_Apuestas",
			userId // The document ID is the userId
		);

		const teamDoc = await getDoc(teamDocRef);

		if (teamDoc.exists()) {
			return teamDoc.data(); // Return the team data if the document exists
		} else {
			console.log("No team found for this user.");
			return null;
		}
	} catch (error) {
		console.error("Error fetching team:", error);
		throw error;
	}
};

export const getUserById = async (uid) => {
	try {
		const userDoc = await getDoc(doc(firestore, "I_Members", uid));
		if (userDoc.exists()) {
			return userDoc.data();
		} else {
			console.log("No such user!");
			return null;
		}
	} catch (error) {
		console.error("Error getting user:", error);
		return null;
	}
};

export const getPlayerName = async (id_player, tournamentId) => {
	try {
		const playerQuery = query(
			collection(firestore, "I_Torneos", tournamentId, "I_Players"),
			where("id_player", "==", id_player)
		);
		const playerQuerySnapshot = await getDocs(playerQuery);
		if (!playerQuerySnapshot.empty) {
			const playerDoc = playerQuerySnapshot.docs[0];
			return playerDoc.data().name;
		} else {
			console.log("No such player!");
			return null;
		}
	} catch (error) {
		console.error("Error getting player:", error);
		return null;
	}
};

export const fetchQualifiers = async (TournamentId, collectionName) => {
	try {
		const querySnapshot = await getDocs(
			collection(firestore, "I_Torneos", TournamentId, collectionName)
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

export const fetchScoreSheet = async (
	id_player,
	tournamentName,
	collectionName
) => {
	try {
		const scoreQuery = query(
			collection(firestore, "I_Torneos", tournamentName, collectionName),
			where("id_player", "==", id_player)
		);
		const querySnapshot = await getDocs(scoreQuery);
		let scoreData = {};
		querySnapshot.docs.forEach((doc) => {
			const data = doc.data();
			for (const key in data) {
				if (/^H(0[1-9]|1[0-8])$/.test(key)) {
					scoreData[key] = data[key];
				}
			}
		});

		const name = await getPlayerName(id_player, tournamentName);
		return scoreData;
	} catch (error) {
		console.error("Error fetching score sheet:", error);
		throw error;
	}
};
export const fetchTournament = async () => {
	try {
		const q = query(
			collection(firestore, "I_Torneos"),
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

export const createI_Cuartos = async () => {
	try {
		const collectionRef = collection(
			firestore,
			"I_Torneos",
			"The_Open_Championship_2024",
			"I_Cuartos"
		);

		for (let i = 1; i <= 8; i++) {
			const cuartoData = {
				H1: 0,
				H2: 0,
				H3: 0,
				H4: 0,
				H5: 0,
				H6: 0,
				H7: 0,
				H8: 0,
				H9: 0,
				H10: 0,
				H11: 0,
				H12: 0,
				H13: 0,
				H14: 0,
				H15: 0,
				H16: 0,
				H17: 0,
				H18: 0,
				id_player: 0,
				orden: 0,
			};
			await addDoc(collectionRef, cuartoData);
		}
		console.log("I_Cuartos created successfully.");
	} catch (error) {
		console.error("Error creating I_Cuartos:", error);
	}
};

export const createI_Semifinales = async (tournamentId) => {
	try {
		const collectionRef = collection(
			firestore,
			"I_Torneos",
			tournamentId,
			"I_Semifinales"
		);

		for (let i = 1; i <= 4; i++) {
			const cuartoData = {
				H1: 0,
				H2: 0,
				H3: 0,
				H4: 0,
				H5: 0,
				H6: 0,
				H7: 0,
				H8: 0,
				H9: 0,
				H10: 0,
				H11: 0,
				H12: 0,
				H13: 0,
				H14: 0,
				H15: 0,
				H16: 0,
				H17: 0,
				H18: 0,
				id_player: 0,
				orden: 0,
				name: 0,
			};
			await addDoc(collectionRef, cuartoData);
		}
		console.log("I_Semifinales created successfully.");
	} catch (error) {
		console.error("Error creating I_Semifinales:", error);
	}
};

export const updateI_Players = async () => {
	try {
		const collectionRef = collection(
			firestore,
			"I_Torneos",
			"The_Open_Championship_2024",
			"I_Players"
		);
		const querySnapshot = await getDocs(collectionRef);

		for (const docSnap of querySnapshot.docs) {
			const playerName = docSnap.id;
			const playerRef = doc(
				firestore,
				"I_Torneos",
				"The_Open_Championship_2024",
				"I_Players",
				playerName
			);

			const updatedData = {
				name: playerName,
				id_player: generateAutoId(),
			};

			await updateDoc(playerRef, updatedData);
		}

		console.log("I_Players updated successfully.");
	} catch (error) {
		console.error("Error updating I_Players:", error);
	}
};

// Function to generate an auto-generated ID
const generateAutoId = () => {
	return (
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15)
	);
};

export const checkIfSemisExist = async (tournamentId) => {
	try {
		const querySnapshot = await getDocs(
			collection(firestore, "I_Torneos", tournamentId, "I_Semifinales")
		);
		return querySnapshot.empty;
	} catch (error) {
		console.error("Error checking semifinals:", error);
		throw error;
	}
};

export const userMadeBet = async (tournamentId, userId) => {
	try {
		const querySnapshot = await getDocs(
			collection(firestore, "I_Torneos", tournamentId, "I_Apuestas")
		);
		return querySnapshot.docs.some((doc) => doc.id === userId);
	} catch (error) {
		console.error("Error checking if user made bet:", error);
		throw error;
	}
};

/**
 *
 * @param {*} tournamentId
 * @returns True or False, if returns null something went wrong with the database
 */
export const getApuestas = async (tournamentId) => {
	try {
		const querySnapshot = await getDocs(
			collection(firestore, "I_Torneos", tournamentId)
		);

		for (const doc of querySnapshot.docs) {
			const data = doc.data();
			if (data.apuestas && data.apuestas.trim() !== "") {
				return data.apuestas;
			}
		}
		return null;
	} catch (error) {
		console.error("Error getting active bracket:", error);
		throw error;
	}
};

/**
 *
 * @param {*} tournamentId
 * @returns a string, either cuartos, semis or finales if there is a bracket active, it returns an empty string if there is no active bracket
 * If it return null, something went wrong with the database
 */
export const getActiveBracket = async (tournamentId) => {
	try {
		// Accede al documento específico en la colección "I_Torneos"
		const docRef = doc(firestore, "I_Torneos", tournamentId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const data = docSnap.data();
			if (data.active_bracket && data.active_bracket.trim() !== "") {
				return data.active_bracket; // Retorna el campo "active_bracket"
			}
		}
		return null; // Si no hay active_bracket o no existe el documento
	} catch (error) {
		console.error("Error getting active bracket:", error);
		throw error;
	}
};

export const isBracketActive = async (tournamentId, collectionName) => {
	try {
		const bracketRef = collection(
			firestore,
			"I_Torneos",
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

export const getNumberPlayersBet = async (tournamentId) => {
	try {
		const docRef = doc(firestore, "I_Torneos", tournamentId);
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

const getMinimumClassification = async (tournamentId) => {
	try {
		const tournamentDocRef = doc(db, "I_Torneos", tournamentId);

		const tournamentDoc = await getDoc(tournamentDocRef);

		if (tournamentDoc.exists()) {
			const data = tournamentDoc.data();
			const minimoClasificacion = data.minimoClasificacion;

			return minimoClasificacion;
		} else {
			console.error("No such document found");
			return null;
		}
	} catch (error) {
		console.error("Error checking bracket:", error);
		throw error;
	}
};
