const database = require("../connection");
const { connection: db } = database;

const SET_INITIALIZED = `
  UPDATE games SET initialized=true
  WHERE id=$1
`;

const setInitialized = (gameId) => db.none(SET_INITIALIZED, [gameId]);

module.exports = { setInitialized };
