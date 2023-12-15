const database = require("../connection");
const { connection: db } = database;

const UPDATE_FOLDED_FALSE = `UPDATE game_users SET folded = false WHERE game_id=$1`;

const updateAllFoldedFalse = (gameId) =>
  db.none(UPDATE_FOLDED_FALSE, [gameId]);

module.exports = { updateAllFoldedFalse };