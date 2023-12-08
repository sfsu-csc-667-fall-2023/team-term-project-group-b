const database = require("../connection");
const { connection: db } = database;

const GET_USERS = `
  SELECT user_id, (
    SELECT sid FROM session
    WHERE (sess->'user'->>'id')::int=user_id
    ORDER BY expire DESC
    LIMIT 1
  ) as sid
  FROM game_users
  WHERE game_id=$1
`;

const getUsers = (gameId) => db.many(GET_USERS, [gameId]);

module.exports = { getUsers };