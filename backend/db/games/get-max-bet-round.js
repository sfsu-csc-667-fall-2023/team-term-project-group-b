const database = require("../connection");
const { connection: db } = database;

const GET_MAX_BET_ROUND = 
`SELECT max_bet_round from game_state WHERE game_id=$1`;


const getMaxBetRound = (gameId) => 
    db.one(GET_MAX_BET_ROUND, [gameId]).then(result =>result.max_bet_round);

module.exports = {getMaxBetRound};