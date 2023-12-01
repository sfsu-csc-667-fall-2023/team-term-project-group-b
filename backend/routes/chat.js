const express = require("express");
const router = express.Router();
const { createHash } = require("crypto");

router.post("/:id", (request, response) => {
    const { id } = request.params;
    const { message } = request.body;
    const { email } = request.session.user;

    const io = request.app.get("io");
    
    io.emit("chat:message:0", {
        //hash: createHash("sha256").update(email).digest("hex"),
        from: email,
        timestamp: Date.now(),
        message,
    });
    response.status(200);
});

module.exports = router; 