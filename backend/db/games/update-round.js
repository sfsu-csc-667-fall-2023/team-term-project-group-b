const database = require("../connection");
const { connection: db } = database;

const UPDATE_ROUND =`UPDATE game_state SET round=$1 WHERE game_id=$2`;

const updateRound = (gameId, roundNumber) => db.none(UPDATE_ROUND, [roundNumber, gameId]);    

module.exports = {updateRound};