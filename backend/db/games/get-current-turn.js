const database = require("../connection");
const { connection: db } = database;

const GET_CURRENT_TURN = `SELECT turn WHERE game_id=$1`;

const getCurrentTurn = (gameId) => db.one(GET_CURRENT_TURN, [gameId]);

module.exports = {getCurrentTurn};