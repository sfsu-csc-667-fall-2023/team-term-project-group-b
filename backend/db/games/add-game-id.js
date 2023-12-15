const database = require("../connection");
const { connection: db } = database;

const CREATE_GAME_STATE = `INSERT INTO game_state (game_id) VALUES ($1)`;

const addGameId = (gameId) => db.none(CREATE_GAME_STATE, [gameId]);

module.exports = { addGameId };