const express = require("express");
const router = express.Router();

router.get("/", (_request, response) => {
    response.render("lobby");
});


module.exports = router; 