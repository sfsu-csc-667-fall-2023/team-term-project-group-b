const database = require("../connection");
const { connection: db } = database;

const SET_CALLED = `
  UPDATE game_users SET called=true WHERE game_id=$1 AND user_id=$2`;

const setCalled = (gameId, userId) =>
  db.none(SET_CALLED, [gameId, userId]);

module.exports = { setCalled };