const database = require("../connection");
const { connection: db } = database;

const GET_CURRENT_TURN = `SELECT turn from game_state WHERE game_id=$1`;

const getCurrentTurn = (gameId) => db.one(GET_CURRENT_TURN, [gameId]).then(result => result.turn);

module.exports = {getCurrentTurn};