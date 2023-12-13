const database = require("../connection");
const { connection: db } = database;

const CREATE_GAME_STATE = `INSERT INTO game_state (game_id, round, turn, player_count, pot) VALUES ($1, $2, $3, $4, $5) RETURNING *`;

const createGameState = (gameId, roundNumber, turn, playerCount, pot) => db.one(CREATE_GAME_STATE, [gameId, roundNumber, turn, playerCount, pot]);

module.exports = { createGameState };
