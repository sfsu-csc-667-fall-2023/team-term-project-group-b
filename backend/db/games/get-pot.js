const database = require("../connection");
const { connection: db } = database;

const GET_POT = `SELECT pot from game_state WHERE game_id=$1`;

const getPot = (gameId) => db.one(GET_POT, [gameId]).then(result=> result.pot);

module.exports = { getPot };