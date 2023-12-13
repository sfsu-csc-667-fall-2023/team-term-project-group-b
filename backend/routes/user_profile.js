const express = require("express");

const { Games } = require("../db");
const user_profile = require("./user_profile")


const router = express.Router();
const {Users} = require("../db/index");

router.get("/profile/:id", async (request, response) => {
    const {id} = request.params;
    response.render("profile", {id: id, username: "lol"});
});

router.get("/", (_request, response) => {
    response.render("home");
});

module.exports = router; 