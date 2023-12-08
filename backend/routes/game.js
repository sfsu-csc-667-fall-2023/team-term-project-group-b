const express = require("express");
const router = express.Router();

const routes = require("./games");

routes.forEach(({ method, route, handler }) => {
  router[method](route, handler);
});

module.exports = router;