const database = require("../connection");
const { connection: db } = database;

const CREATE = "INSERT INTO games (game_socket_id) VALUES ($1) RETURNING id";

const create = (gameSocketId) => db.one(CREATE, [gameSocketId]);

module.exports = { create };