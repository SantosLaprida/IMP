import { get } from "firebase/database";
import { getScoreSheet } from "../api";
import { getPlayerName } from "../server/firestoreFunctions";
import { processSemis } from "../server/semisUtils/semisUtils";

export const compareScores = async (
	id_player1,
	id_player2,
	tournamentName,
	collectionName
) => {
	const scoreSheet1 = await getScoreSheet(
		id_player1,
		tournamentName,
		collectionName
	);
	const scoreSheet2 = await getScoreSheet(
		id_player2,
		tournamentName,
		collectionName
	);

	const name1 = await getPlayerName(id_player1, tournamentName);
	const name2 = await getPlayerName(id_player2, tournamentName);

	let score = {
		currentHole: 1,
		holesPlayed: 0,
		holesRemaining: 18,
		result: 0,
		stillPlaying: true,
	};

	if (scoreSheet1 === null || scoreSheet2 === null) {
		return null;
	}

	while (score.currentHole <= 18) {
		const score1 = scoreSheet1[`H${score.currentHole}`];
		const score2 = scoreSheet2[`H${score.currentHole}`];

		if (score1 === 0 || score2 === 0) {
			score.currentHole++;
			continue;
		}

		if (score1 === score2) {
			score.holesPlayed++;
			score.holesRemaining--;
			score.currentHole++;
			continue;
		}

		if (score1 < score2) {
			score.result--;
			score.holesPlayed++;
			score.holesRemaining--;
			score.currentHole++;
			continue;
		}
		if (score1 > score2) {
			score.result++;
			score.holesPlayed++;
			score.holesRemaining--;
			score.currentHole++;
			continue;
		}

		score.currentHole++;
	}

	if (score.holesPlayed === 18) {
		score.stillPlaying = false;
	}

	if (score.result === 0 && score.stillPlaying === false) {
		for (let i = 1; i <= 18; i++) {
			const score1 = scoreSheet1[`H${i}`];
			const score2 = scoreSheet2[`H${i}`];

			if (score1 < score2) {
				score.result--;
				break;
			}
			if (score1 > score2) {
				score.result++;
				break;
			}
		}
	}

	if (score.stillPlaying === false) {
		// If the game is over, then we can store the result in firebase
		if (collectionName === "I_Cuartos") {
			// Call a function yet to be created that is going to be in a file inside server directory, inside quarterUtils directory
			// We will need to pass the tournamentName, the id of the two players, and the result of the game
		} else if (collectionName === "I_Semifinales") {
			// Call a function yet to be created that is going to be in a file inside server directory, inside semisUtils directory
			// We will need to pass the tournamentName, the id of the two players, and the result of the game

			await processSemis(tournamentName, id_player1, id_player2, score.result);
		}
	}

	return score;
};

export const showResults = (results, player_name1, player_name2) => {
	if (results === null) {
		return "";
	}

	if (results.stillPlaying) {
		if (results.result === 0) {
			return `All Square, ${results.holesRemaining} holes remaining`;
		}

		if (results.result > 0) {
			return `${results.result}d ${results.holesRemaining} holes remaining ${results.result} u`;
		}

		if (results.result < 0) {
			return `${results.result * -1}u ${results.holesRemaining} holes remaining ${results.result * -1}d`;
		}
	} else {
		if (results.result === 0) {
			return `All Square`;
		}

		if (results.result > 0) {
			return `${player_name1} won by a difference of ${results.result} holes`;
		}

		if (results.result < 0) {
			return `${player_name2} won by a difference of ${results.result * -1} holes`;
		}
	}

	return results.result;
};
