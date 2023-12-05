const  db = require("./connection")

const CREATE = "INSERT INTO games (game_socket_id) VALUES ($1) RETURNING id";
const ADD_USER = "INSERT INTO game_users (user_id, game_id) VALUES ($1, $2)";
const GET_GAME = "SELECT * FROM games WHERE id=$1";
const GET_AVAILABLE_GAMES = "SELECT * FROM games";
const GET_GAME_USER_COUNT = "SELECT COUNT(*) FROM game_users WHERE game_id=$1"
const IS_PLAYER_IN_GAME = `SELECT COUNT(*) FROM game_users WHERE game_id=$1 AND user_id=$2`;
const USERS_IN_GAME = `SELECT * FROM game_users, users WHERE game_users.game_id = $1 AND game_users.user_id = users.id`;
const IS_INITIALIZED = `SELECT initialized FROM games WHERE id=$1`;
const READY_PLAYER = `UPDATE game_users SET ready=true WHERE user_id=$1 AND game_id=$2`;
const READY_COUNT = `SELECT (SELECT COUNT(*) FROM game_users WHERE game_id=$1) AS player_count,
    (SELECT COUNT(*) FROM game_users WHERE game_id=$1 AND ready=true) as ready_count`;
const create = (gameSocketId) => db.one(CREATE, [gameSocketId]);

const addUser = (userId, gameId) => db.none(ADD_USER, [userId, gameId]);

const getGame = (gameId) => db.one(GET_GAME, gameId);

const getAvailableGames = () => db.any(GET_AVAILABLE_GAMES);

const getUserCount = (id) => db.one(GET_GAME_USER_COUNT, [id]).then(({count}) => parseInt(count));

const isPlayerInGame = (gameId, userId) => db.one(IS_PLAYER_IN_GAME, [gameId, userId]).then(({ count }) => parseInt(count) === 1);

const usersInGame = (gameId) => db.any(USERS_IN_GAME, [gameId]);

const isInitialized = (gameId) => db.one(IS_INITIALIZED, [gameId]);

const initialize = async (gameId) => {
  // todo: for now:
  const {game_socket_id} = await getGame(gameId);
  return{
    game_socket_id,
  }
}

const getState = async (gameId) => { 
  // todo: for now:
  const {game_socket_id} = await getGame(gameId);
  return{
    game_socket_id,
  }
}

const readyPlayer = (userId, gameId) =>
  db.none(READY_PLAYER, [userId, gameId]).then((_) => db.one(READY_COUNT, [gameId]))
    .then(({ player_count, ready_count }) => ({
      player_count: parseInt(player_count),
      ready_count: parseInt(ready_count),
    }));

module.exports = {
  create,
  addUser,
  getGame,
  getAvailableGames,
  getUserCount,
  isPlayerInGame,
  usersInGame,
  isInitialized,
  readyPlayer,
  initialize,
  getState,
};