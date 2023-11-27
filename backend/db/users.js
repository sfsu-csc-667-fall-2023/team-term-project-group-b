const { default: db } = require("node-pg-migrate/dist/db");

const EMAIL_EXISTANCE = "SELECT email FROM user WHERE email=$1";
const USERNAME_EXISTANCE = "SELECT username WHERE username=$1 RETURNING username";
const ADD_USER ='INSERT INTO user (email, password, username) VALUES ($1, $2, $3) RETURNING id, email';
const SIGN_USER_IN = 'SELECT * FROM user WHERE email=$1';

const email_exists = (email)=>{
    return db.one(EMAIL_EXISTANCE, [email]).then(_ => true).catch(_ => false);
    
}

const username_exists = (username) =>{
     return db.one(USERNAME_EXISTANCE, username).then(_ => true).catch(_ => false);
    }

const create = (email, password, username) => db.one(ADD_USER, [email, password, username]);

const find_by_email = (email) => db.one(SIGN_USER_IN, [email]);

module.exports = {
    email_exists,
    username_exists,
    create,
    find_by_email,
};