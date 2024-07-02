import { and } from 'firebase/firestore';
import { getScoreSheet } from '../api';

export const compareScores = async (id_player1, id_player2) => {
    const scoreSheet1 = await getScoreSheet(id_player1);
    const scoreSheet2 = await getScoreSheet(id_player2);

    console.log(scoreSheet1, "SCORESHEET")
    console.log(scoreSheet2, "SCORESHEET2")

    let score = {
        player1: 0,
        player2: 0,
        currentHole: 1,
        result: ''
    };

    if (scoreSheet1 === null || scoreSheet2 === null) {
        return null;
    }

    if (scoreSheet1.H1 === 0 && scoreSheet2.H1 === 0) {
        return null;

    }
    else if (scoreSheet1.H1 === 0 || scoreSheet2.H1 === 0) {
        return null;

    } else{
        
        
        while (score.currentHole <= 18) {
            const score1 = scoreSheet1[`H${score.currentHole}`];
            const score2 = scoreSheet2[`H${score.currentHole}`];
            if (score1 === 0 || score2 === 0) {
                return score;
            }
            if (score1 < score2) {
                score.player1++;
                break;
            } else if (score1 > score2) {
                score.player2++;
                break;
            }
            if (score.player1 === score.player2){
                score.result = "All Square";
            }
            score.currentHole++;
        }
    }
    return score;
}