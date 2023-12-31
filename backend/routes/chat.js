const express = require("express");
const router = express.Router();
const { createHash } = require("crypto");

router.post("/:id", (request, response) => {
    const {id} = request.params;
    const { message } = request.body;
    if(message.length > 0){
    const { username } = request.session.user;
    const io = request.app.get("io");
    io.emit(`chat:message:${id}`, {
        hash: createHash("sha256").update(username).digest("hex"),
        from: username,
        timestamp: Date.now(),
        message,
    });
}   response.status(200).send();
});




module.exports = router; 