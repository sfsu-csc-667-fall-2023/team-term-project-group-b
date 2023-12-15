const database = require("../connection");
const { connection: db } = database;

const GET_INGAME_COUNT = `
  SELECT COUNT(*) as count_of_users
  FROM game_users
  WHERE game_id = $1 AND folded = false;
`;

const getPlayerInGameCount = (gameId) => db.one(GET_INGAME_COUNT, [gameId])
    .then(result => parseInt(result.count_of_users));

module.exports = {getPlayerInGameCount};