const database = require("../connection");
const { connection: db } = database;

const SET_CURRENT_PLAYER = `
  UPDATE game_state SET turn=$1
  WHERE game_id=$2
  RETURNING turn
`;

const setCurrentPlayer = (gameId, playerId) =>
  db.one(SET_CURRENT_PLAYER, [playerId, gameId]);

module.exports = { setCurrentPlayer };