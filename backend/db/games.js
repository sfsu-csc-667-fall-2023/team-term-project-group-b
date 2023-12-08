const database = require("./connection");
const { connection: db, pgp } = database;
const Users = require("./users");

const {initialize} = require("./games/initialize");

// Table: games
const CREATE = "INSERT INTO games (game_socket_id) VALUES ($1) RETURNING id";
const GET_AVAILABLE_GAMES = "SELECT * FROM games";
const GET_GAME_SOCKET = `SELECT game_socket_id FROM games WHERE id=$1`;
const IS_INITIALIZED = `SELECT initialized FROM games WHERE id=$1`;
const SET_GAME_CURRENT_PLAYER = "UPDATE games SET current_seat=0 WHERE id=$2";
const SET_WINNER = `UPDATE games SET winner=$1 WHERE id=$2`;

// Table: game_state
const CREATE_GAME_STATE = `INSERT INTO game_state (game_id, round, turn, player_count, pot) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
const UPDATE_TOTAL_PLAYERS = `UPDATE game_state SET player_count=$1 WHERE game_id=$2 RETURNING player_count`;
const UPDATE_TURN = `UPDATE game_state SET turn=$1 WHERE game_id=$2 RETURNING turn`;
const UPDATE_POT  = `UPDATE game_state SET pot=$1 WHERE game_id=$2 RETURNING pot`;
const UPDATE_ROUND =`UPDATE game_state SET round=$1 WHERE game_id=$2 RETURNING round`;
const GET_GAME_STATE = "SELECT * FROM game_state WHERE id=$1";

// Table: game_users
const GET_GAME_USERS = "SELECT user_id FROM game_users WHERE game_id=$1";
const GET_GAME_USER_COUNT = "SELECT COUNT(*) FROM game_users WHERE game_id=$1";
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
const getUserCount = (gameId) => db.one(GET_GAME_USER_COUNT, [gameId]).then(({count}) => parseInt(count));
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
const createGameState = (gameId, roundNumber, turn, playerCount, pot) => db.one(CREATE_GAME_STATE, [gameId, roundNumber, turn, playerCount, pot]);
const updateTurn = (gameId, turn) => {db.one(UPDATE_TURN, [turn, gameId])};
const updatePot = (gameId, pot) => {db.one(UPDATE_POT, [pot, gameId])};
const updateRound = (gameId, roundNumber) => {db.one(UPDATE_ROUND, [roundNumber, gameId])};

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    // cards
    const SHUFFLED_DECK = "SELECT *, random() AS rand FROM cards ORDER BY rand";
    const GET_PLAYER_BY_SEAT = "SELECT user_id FROM game_users WHERE seat=$1 AND game_id=$2";
    const GET_CARDS = "SELECT card_id FROM game_cards WHERE game_id=$1 AND user_id=0 ORDER BY card_order LIMIT $2";
    const DEAL_CARD = "UPDATE game_cards SET user_id=$1 WHERE game_id=$2 AND card_id=$3";
    

module.exports = {
  create,
  addUser,
  getGameSocket,
  getAvailableGames,
  getUserCount,
  isPlayerInGame,
  usersInGame,
  isInitialized,
  readyPlayer,
  initialize,
  createGameState,
  updateRound,
  updateTurn,
  updatePot,
  setUserChips,

};