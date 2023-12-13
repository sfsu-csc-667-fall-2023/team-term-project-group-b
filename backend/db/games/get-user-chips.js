const database = require("../connection");
const { connection: db } = database;

const GET_USER_CHIPS = `
  SELECT chips FROM game_users
  WHERE game_id=$1 AND user_id=$2
`;

const getUserChips = (gameId, userId) =>
  db.one(GET_USER_CHIPS, [gameId, userId]).then(({ chips }) => chips);

module.exports = { getUserChips };