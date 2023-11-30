const express = require("express");

const router = express.Router();
const {Users} = require("../db/index");

router.get("/:id", async (request, response) => {
    const {id} = request.params;
    response.render("user_profile", {id: id, username: "lol"});
});

module.exports = router; 