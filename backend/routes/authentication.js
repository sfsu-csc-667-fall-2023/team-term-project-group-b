const express = require("express");
const bcrypt = require("bcrypt");
const {Users} = require('../db/index');
const router = express.Router();

const SALT_ROUNDS = 10;

router.get("/signup", (_request, response) => {
    response.render("sign_up");
});

router.get("/login", (_request, response) => {
    response.render("login");
});

router.post("/login", async(request, response) =>{
    const {email, password} = request.body;
    try{
    const user = await Users.find_by_email(email);
    const isValidUser = await bcrypt.compare(password, user.password);
    if(isValidUser){
        //store in session and redirect

        response.status(200).redirect("lobby");
        console.log(user);
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
        return response.status(400).render("sign_up", {
            error: 'Invalid email address'
        });
    }
    if(passwordRegex.test(password) || passwordRegex.test(username)){
        return response.status(400).render("sign_up", {
            error: 'Invalid username or password: use alphanumeric/special characters only'
        });
    }
    if(password.length <= 5 || username.length <= 5){
        return response.status(400).render("sign_up", {
            error: 'Invalid username or password: length must be 6 chars or more'
        });
    }
    const email_exists = await Users.email_exists(email);
    const username_exists = await Users.username_exists(username);
    if(email_exists){
        return response.status(400).render("sign_up", {
            error: `Email: ${email} already in use`
        });
    }
    if(username_exists){
        return response.status(400).render("sign_up", {
            error: `Username: ${username} already in use.`
        });
    }
    // email and username do not exist: encrypt
    else{
        console.log("sucess");
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hash = await bcrypt.hash(password, salt);
        const id = Users.create(email, hash, username)
        return response.status(200).redirect("/login")
    }
    response.redirect("/");
});

module.exports = router; 