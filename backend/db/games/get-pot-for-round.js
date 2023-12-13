const database = require("../connection");
const { connection: db } = database;

const GET_POT_FOR_ROUND = `SELECT pot_for_round from game_state WHERE game_id=$1`;

const getPotForRound = (gameId) => db.one(GET_POT_FOR_ROUND, [gameId]);

module.exports = { getPotForRound };