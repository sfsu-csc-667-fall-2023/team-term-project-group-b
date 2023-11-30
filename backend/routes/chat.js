const express = require("express");
const router = express.Router();

router.post("/:id", (request, response) => {
    const {id, message} = request.params;
    console.log({id, message});
    response.status(200);
});

module.exports = router; 