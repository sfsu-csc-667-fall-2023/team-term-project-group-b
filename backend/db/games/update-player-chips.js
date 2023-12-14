const database = require("../connection");
const { connection: db } = database;

const UPDATE_PLAYER_CHIPS = `UPDATE game_users SET chips=$1 WHERE game_id=$2 AND user_id=$3`;

const updatePlayerChips = (gameId, userId, chips) => db.none(UPDATE_PLAYER_CHIPS, [chips, gameId, userId]);

module.exports = { updatePlayerChips };
