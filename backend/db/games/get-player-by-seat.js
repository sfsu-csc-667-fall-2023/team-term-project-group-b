const database = require("../connection");
const { connection: db } = database;

const GET_PLAYER_BY_SEAT = `
  SELECT user_id FROM game_users
  WHERE seat=$1 AND game_id=$2
`;

const getPlayerBySeat = (gameId, seatIndex) =>
  db.one(GET_PLAYER_BY_SEAT, [seatIndex, gameId]).then(result => result.user_id);
module.exports = { getPlayerBySeat };