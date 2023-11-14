const express = require("express");
const router = express.Router();

router.get("/:id", (request, response) => {
    const {id} = request.params;
    response.render("user_profile", {id});
});

module.exports = router; 