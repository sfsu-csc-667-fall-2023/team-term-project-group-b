const database = require("../connection");
const { connection: db } = database;

const RESET_CALLED = `UPDATE game_users SET called = false WHERE game_id = $1`;

  const resetCalled = (gameId) => db.none(RESET_CALLED, [gameId]);

  module.exports = {resetCalled};