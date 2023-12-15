const database = require("../connection");
const { connection: db } = database;

const RESET_MAX_BET = `UPDATE game_state SET max_bet_round=0 WHERE game_id=$1`;

  const resetMaxBet = (gameId) => db.none(RESET_MAX_BET, [gameId]);

  module.exports = {resetMaxBet};