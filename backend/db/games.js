const  db = require("./connection")

const CREATE = "INSERT INTO games (game_socket_id) VALUES ($1) RETURNING id";
const ADD_USER = "INSERT INTO game_users (user_id, game_id) VALUES ($1, $2)";
const GET_GAME = "SELECT * FROM games WHERE id=$1";
const GET_AVAILABLE_GAMES = "SELECT * FROM games";

const create = (gameSocketId) => db.one(CREATE, [gameSocketId]);

const addUser = (userId, gameId) => db.none(ADD_USER, [userId, gameId]);

const getGame = (gameId) => db.one(GET_GAME, gameId);

const getAvailableGames = () => db.any(GET_AVAILABLE_GAMES);

module.exports = {
  create,
  addUser,
  getGame,
  getAvailableGames,
};