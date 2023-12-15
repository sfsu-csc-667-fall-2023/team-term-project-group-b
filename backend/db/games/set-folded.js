const database = require("../connection");
const { connection: db } = database;

const SET_FOLDED = `UPDATE game_users SET folded=true WHERE game_id=$1 AND user_id=$2`;


const setFolded = (gameId, userId) => db.none(SET_FOLDED, [gameId, userId]);

module.exports = {setFolded};