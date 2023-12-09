const database = require("../connection");
const { connection: db } = database;

const GET_CARDS = `
  SELECT * FROM game_cards, cards
  WHERE game_cards.game_id=$1 AND game_cards.card_id=cards.id AND game_cards.user_id!=0
`;

const getCards = (gameId) => db.any(GET_CARDS, [gameId]);

module.exports = { getCards };