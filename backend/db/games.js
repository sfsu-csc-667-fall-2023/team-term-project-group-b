const database = require("./connection");
const { connection: db } = database;

const { initialize } = require("./games/initialize");
const { getCards } = require("./games/get-cards");
const { getState } = require("./games/get-game-state");
const {getCurrentTurn} = require("./games/get-current-turn");
const { getPlayerSeat } = require("./games/get-player-seat");
const {getPlayerBySeat} = require("./games/get-player-by-seat");
const {checkTurn} = require("./games/check-turn");
const {updateTurn} = require("./games/update-turn")
const {updateTurnTable} = require("./games/update-turn-table");
const {getUserCount} = require("./games/get-user-count");
const {getUserChips} = require("./games/get-user-chips");
const {createGameState} = require("./games/create-game-state");
const {updateUserChips} = require("./games/update-user-chips");

// Table: games
const CREATE = "INSERT INTO games (game_socket_id) VALUES ($1) RETURNING id";
const GET_AVAILABLE_GAMES = "SELECT * FROM games";
const GET_GAME_SOCKET = `SELECT game_socket_id FROM games WHERE id=$1`;
const IS_INITIALIZED = `SELECT initialized FROM games WHERE id=$1`;
const SET_WINNER = `UPDATE games SET winner=$1 WHERE id=$2`;

// Table: game_state
const UPDATE_TOTAL_PLAYERS = `UPDATE game_state SET player_count=$1 WHERE game_id=$2 RETURNING player_count`;

const UPDATE_POT  = `UPDATE game_state SET pot=$1 WHERE game_id=$2 RETURNING pot`;
const UPDATE_ROUND =`UPDATE game_state SET round=$1 WHERE game_id=$2 RETURNING round`;

// Table: game_users
const GET_GAME_USERS = "SELECT user_id FROM game_users WHERE game_id=$1";
const USERS_IN_GAME = `SELECT * FROM game_users, users WHERE game_users.game_id = $1 AND game_users.user_id = users.id`;
const READY_PLAYER = `UPDATE game_users SET ready=true WHERE user_id=$1 AND game_id=$2`;
const READY_COUNT = `SELECT (SELECT COUNT(*) FROM game_users WHERE game_id=$1) AS player_count,
(SELECT COUNT(*) FROM game_users WHERE game_id=$1 AND ready=true) as ready_count`;
const ADD_USER = "INSERT INTO game_users (user_id, game_id, seat) VALUES ($1, $2, $3)";
const IS_PLAYER_IN_GAME = `SELECT COUNT(*) FROM game_users WHERE game_id=$1 AND user_id=$2`;
const SET_USER_CHIPS = `UPDATE game_users SET chips=100 WHERE game_id=$1 AND user_id=$2 RETURNING chips`;

// games
const create = (gameSocketId) => db.one(CREATE, [gameSocketId]);
const getAvailableGames = () => db.any(GET_AVAILABLE_GAMES);
const getGameSocket = (gameId) => db.one(GET_GAME_SOCKET, gameId);
const isInitialized = (gameId) => db.one(IS_INITIALIZED, [gameId]);
const setWinner = (gameId, userId) => db.one(SET_WINNER, [userId, gameId])


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// game_users
const isPlayerInGame = (gameId, userId) => db.one(IS_PLAYER_IN_GAME, [gameId, userId]).then(({ count }) => parseInt(count) === 1);
const usersInGame = (gameId) => db.any(USERS_IN_GAME, [gameId]);

const readyPlayer = (userId, gameId) =>
  db.none(READY_PLAYER, [userId, gameId]).then((_) => db.one(READY_COUNT, [gameId]))
    .then(({ player_count, ready_count }) => ({
      player_count: parseInt(player_count),
      ready_count: parseInt(ready_count),
    }));

const addUser = (gameId, userId) => getUserCount(gameId).then(
  count => {
    return Promise.all([
      db.none(ADD_USER, [userId, gameId, count + 1]),
      db.any(UPDATE_TOTAL_PLAYERS, [count + 1, gameId])
    ]);
  }
); 

const setUserChips = (gameId, userId) => db.one(SET_USER_CHIPS, [gameId, userId]);

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// game_state
const updatePot = (gameId, pot) => {db.one(UPDATE_POT, [pot, gameId])};
const updateRound = (gameId, roundNumber) => {db.one(UPDATE_ROUND, [roundNumber, gameId])};    

module.exports = {
  getCards,
  create,
  addUser,
  getGameSocket,
  getAvailableGames,
  isPlayerInGame,
  usersInGame,
  isInitialized,
  readyPlayer,
  initialize,
  createGameState,
  updateRound,
  updateTurnTable,
  updatePot,
  setUserChips,
  getState,
  getCurrentTurn,
  getPlayerSeat,
  getPlayerBySeat,
  checkTurn,
  updateTurn,
  getUserCount,
  getUserChips,
  updateUserChips,

};