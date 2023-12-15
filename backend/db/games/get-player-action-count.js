const database = require("../connection");
const { connection: db } = database;

const GET_COUNT = `SELECT COUNT(*) as count_of_users
FROM game_users
WHERE game_id = $1 AND called = true AND folded = false;
`

const getPlayerActionCount = (gameId) => db.one(GET_COUNT, [gameId])
    .then(result =>parseInt(result.count_of_users));

module.exports = {getPlayerActionCount};