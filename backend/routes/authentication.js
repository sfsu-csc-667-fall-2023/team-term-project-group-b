const express = require("express");
const router = express.Router();

router.get("/sign_up", (_request, response) => {
    response.render("sign_up");
});

router.get("/login", (_request, response) => {
    response.render("login");
});

module.exports = router; 