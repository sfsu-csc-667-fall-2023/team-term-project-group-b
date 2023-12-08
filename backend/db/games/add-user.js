const database = require("../connection");
const { connection: db } = database;
const { getUsers } = require("./get-users");

const ADD_USER = "INSERT INTO game_users (user_id, game_id, seat) VALUES ($1, $2, $3)";
const UPDATE_TOTAL_PLAYERS = `UPDATE game_state SET player_count=$1 WHERE game_id=$2 RETURNING player_count`;

const addUser = (gameId, userId) => getUsers(gameId).then(
  count => {
    return Promise.all([
      db.none(ADD_USER, [userId, gameId, count + 1]),   //
      db.any(UPDATE_TOTAL_PLAYERS, [count + 1, gameId]) //
    ]);
  }
); 

module.exports = { addUser };