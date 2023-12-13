const database = require("../connection");
const { connection: db } = database;

const UPDATE_USER_CHIPS = `UPDATE game_users SET chips=$1 WHERE game_id=$2 AND user_id=$3`;

const updateUserChips = (gameId, userId, chips) => db.one(UPDATE_USER_CHIPS, [chips, gameId, userId]);

module.exports = { updateUserChips };
