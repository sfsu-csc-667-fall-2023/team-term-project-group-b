const database = require("../connection");
const { connection: db } = database;

const DRAW_CARDS = `
  SELECT * FROM game_cards, cards
  WHERE game_cards.game_id=$1 AND game_cards.user_id=0 AND game_cards.card_id=cards.id
  ORDER BY game_cards.card_order LIMIT $2
`;

const drawCards = (gameId, cardCount) =>
  db.many(DRAW_CARDS, [gameId, cardCount]);

module.exports = { drawCards };