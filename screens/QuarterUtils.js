
import { get } from 'firebase/database';
import { getScoreSheet } from '../api';
import { getPlayerName } from '../server/firestoreFunctions';

export const compareScores = async (id_player1, id_player2, tournamentName, collectionName) => {

    const scoreSheet1 = await getScoreSheet(id_player1, tournamentName, collectionName);
    const scoreSheet2 = await getScoreSheet(id_player2, tournamentName, collectionName);

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
                return score;
            }
            if (score1 > score2) {
                score.result++;
                return score;
            }
        }
    }

    console.log('returning score for ', name1, ' and ', name2, score);
    return score;
}

export const showResults = (results, player_name1, player_name2) => {

    console.log(player_name1, player_name2);

    if (results === null) {
        return '';  
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
    }else{
        if (results.result === 0) {
            return `All Square`;
        }

        if (results.result > 0) {
            return `${player_name1} won by a difference of ${results.result} holes`;
        }

        if (results.result < 0) {
            return `${player_name2} won by a difference of ${results.result * - 1} holes`;
        }
    }

    return results.result;
}