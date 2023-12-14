const database = require("../connection");
const { connection: db } = database;

const UPDATE_MAX_BET_ROUND = 
`UPDATE game_state SET max_bet_round=$1 WHERE game_id=$2`;


const updateMaxBetRound = (gameId, maxBet) => 
    db.none(UPDATE_MAX_BET_ROUND, [maxBet, gameId]);

module.exports = {updateMaxBetRound};