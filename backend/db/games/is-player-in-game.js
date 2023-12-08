const database = require("../connection");
const { connection: db } = database;

const IS_PLAYER_IN_GAME = `SELECT COUNT(*) FROM game_users WHERE game_id=$1 AND user_id=$2`;

const isPlayerInGame = (gameId, userId) =>
  db
    .one(IS_PLAYER_IN_GAME, [gameId, userId])
    .then(({ count }) => parseInt(count) === 1);

module.exports = { isPlayerInGame };