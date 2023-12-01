const{  isAuthenticated } = require("./is-Authenticated");
const{  sessionLocals   } = require("./session.locals");
const{ requestTime } = require("./request-time");

module.exports = {
    isAuthenticated, sessionLocals, requestTime
}
