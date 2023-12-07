const express = require("express");
const bcrypt = require("bcrypt");
const {Users} = require('../db/index');
const router = express.Router();

const SALT_ROUNDS = 10;

router.get("/signup", (_request, response) => {
    response.render("signup");
});

router.get("/login", (_request, response) => {
    response.render("login");
});

router.post("/login", async(request, response) =>{
    const {username, password} = request.body;
    try{
    const user = await Users.find_by_username(username);
    const isValidUser = await bcrypt.compare(password, user.password);
    if(isValidUser){
        request.session.user = {
            id: user.id,
            username,
        }
        console.log(request.session);
        response.status(200).redirect("/lobby");
    }
    else{
        return response.status(401).render("login", {
            error: 'The credentials you supplied are wrong'
        });
    }
    }catch(error){
        console.log(error);
        return response.status(401).render("login", {
            error: 'The credentials you supplied are wrong'
        });
    }

});

router.post("/signup", async(request, response) =>{
    const {email, password, username} = request.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /[^a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    if(!emailRegex.test(email)){
        return response.status(400).render("signup", {
            error: 'Invalid email address'
        });
    }
    if(passwordRegex.test(password) || passwordRegex.test(username)){
        return response.status(400).render("signup", {
            error: 'Invalid username or password: use alphanumeric/special characters only'
        });
    }
    if(password.length <= 5 || username.length <= 5){
        return response.status(400).render("signup", {
            error: 'Invalid username or password: length must be 6 chars or more'
        });
    }
    const email_exists = await Users.email_exists(email);
    const username_exists = await Users.username_exists(username);
    if(email_exists){
        return response.status(400).render("signup", {
            error: `Email: ${email} already in use`
        });
    }
    if(username_exists){
        return response.status(400).render("signup", {
            error: `Username: ${username} already in use.`
        });
    }
    // email and username do not exist: encrypt
    else{
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hash = await bcrypt.hash(password, salt);
        const id = Users.create(email, hash, username)
        return response.status(200).redirect("/auth/login")
    }
});
router.get("/logout", async(request, response) =>{
    request.session.destroy((err) => {
        if (err) {
            console.error(err);
            response.status(500).send("Error logging out");
        } else {
            response.redirect('/auth/login'); // Redirect to login page after logout
        }
    });
});

module.exports = router; 