const database = require("../connection");
const { connection: db } = database;

const SET_GAME_CARD = `UPDATE game_cards SET user_id=$1 WHERE game_id=$2 AND card_id=$3`;


const setGameCards = (gameId, userId, cardId) => db.none(SET_GAME_CARD, [userId, gameId, cardId]);

module.exports = {setGameCards};