const database = require("../connection");
const { connection: db } = database;

const UPDATE_GAME_LOOP = `
  UPDATE game_users
  SET called = false
  WHERE game_id = $1 AND user_id <> $2;
`;

const updateGameLoop = (gameId, userId) => db.none(UPDATE_GAME_LOOP, [gameId, userId]);

module.exports = {updateGameLoop};