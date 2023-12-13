const database = require("../connection");
const { connection: db } = database;

const UPDATE_TURN = `UPDATE game_state SET turn=$1 WHERE game_id=$2 RETURNING turn`;

const updateTurnTable = (gameId, turn) => {db.one(UPDATE_TURN, [turn, gameId])};

module.exports = {updateTurnTable};