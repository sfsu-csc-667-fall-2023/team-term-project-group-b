const database = require("./connection");
const { connection: db, pgp } = database;

const EMAIL_EXISTANCE = 'SELECT email FROM "users" WHERE email=$1';
const USER_EXISTENCE = "SELECT username FROM users WHERE username=$1";
const ADD_USER =
  "INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING id, email, username";
const SIGN_USER_IN = "SELECT * FROM users WHERE username=$1";
const GET_USER_SOCKET =
  "SELECT sid FROM session WHERE sess->'user'->>'id'='$1' ORDER BY expire DESC LIMIT 1";
const GET_CURRENT_PLAYER_USERNAME =
  "SELECT username FROM users WHERE id=$1";

const username_exists = (username) =>{
  db
    .one(USER_EXISTENCE, [username])
    .then((_) => true)
    .catch((_) => false);
}

const email_exists = (email)=>{
    return db.one(EMAIL_EXISTANCE, [email]).then(_ => true).catch(_ => false); }

const create = (email, password, username) => db.one(ADD_USER, [email, password, username]);

const find_by_username = (username) => db.one(SIGN_USER_IN, [username]);

const getUserSocket = (userId) => db.one(GET_USER_SOCKET, [userId]).then(result => result.sid);

const getUsername = (userId) => db.one(GET_CURRENT_PLAYER_USERNAME, [userId]).then(result => result.username);

module.exports = {
  email_exists,
  username_exists,
  create,
  find_by_username,
  getUserSocket,
  getUsername,
};