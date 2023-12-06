const database = require("./connection");
const { connection: db, pgp } = database;

const USER_EXISTENCE = "SELECT email FROM users WHERE email=$1";
const ADD_USER =
  "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email";
const SIGN_USER_IN = "SELECT * FROM users WHERE email=$1";
const GET_USER_SOCKET =
  "SELECT sid FROM session WHERE sess->'user'->>'id'='$1' ORDER BY expire DESC LIMIT 1";

const email_exists = (email) =>
  db
    .one(USER_EXISTENCE, [email])
    .then((_) => true)
    .catch((_) => false);

const create = (email, password) => db.one(ADD_USER, [email, password]);

const find_by_email = (email) => db.one(SIGN_USER_IN, [email]);

const getUserSocket = (userId) => db.one(GET_USER_SOCKET, [userId]);

module.exports = {
  email_exists,
  create,
  find_by_email,
  getUserSocket,
};