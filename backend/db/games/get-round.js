const database = require("../connection");
const { connection: db } = database;

const GET_ROUND = `SELECT round FROM game_state WHERE game_id=$1`;

const getRound = (gameId) => db.one(GET_ROUND, [gameId]).then(result => result.round);

module.exports = { getRound };