
const database = require("../connection");
const { connection: db } = database;

const GET_DEALER_HAND = `
  SELECT * FROM game_cards, cards
  WHERE game_cards.game_id=$1 AND game_cards.card_id=cards.id AND game_cards.user_id=-1
`;

const getDealerHand = (gameId) => db.any(GET_DEALER_HAND, [gameId]);

module.exports = {getDealerHand};