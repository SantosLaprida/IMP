import { and } from 'firebase/firestore';
import { getScoreSheet } from '../api';

export const compareScores = async (id_player1, id_player2) => {
    const scoreSheet1 = await getScoreSheet(id_player1);
    const scoreSheet2 = await getScoreSheet(id_player2);

    let score = {
        currentHole: 1,
        result: 0
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
        if (score1 < score2) {
            score.result--;
            score.currentHole++;
            continue;

        } else if (score1 > score2) {
            score.result++;
            score.currentHole++;
            continue;
        }

        score.currentHole++;
    }
    console.log('Match result:', score.result, 'at hole:', score.currentHole);
    return score;
}