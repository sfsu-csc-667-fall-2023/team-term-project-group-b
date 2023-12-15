const database = require("../connection");
const { connection: db } = database;

const WIPE_CARDS = `DELETE FROM game_cards WHERE game_id = $1`;

const wipeCards = (gameId) =>
  db.none(WIPE_CARDS, [gameId]);

module.exports = { wipeCards };