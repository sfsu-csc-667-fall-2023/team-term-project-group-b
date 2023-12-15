const database = require("../connection");
const { connection: db } = database;

const GET_FOLDED = `SELECT folded from game_users WHERE game_id=$1 AND user_id=$2`;


const getFolded = (gameId, userId) => db.one(GET_FOLDED, [gameId, userId]).then(result => result.folded);

module.exports = {getFolded};