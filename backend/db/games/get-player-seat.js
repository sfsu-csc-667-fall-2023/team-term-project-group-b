const database = require("../connection");
const { connection: db } = database;

const GET_PLAYER_BY_SEAT = `
  SELECT seat FROM game_users
  WHERE game_id=$1 AND user_id=$2;
`;

const getPlayerSeat = (gameId, userId) =>
  db.one(GET_PLAYER_BY_SEAT, [gameId, userId]).then(result => result.seat);

module.exports = { getPlayerSeat };