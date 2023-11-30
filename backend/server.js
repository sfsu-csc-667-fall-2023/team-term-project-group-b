require("dotenv").config();

const createError = require("http-errors");
const {isAuthenticated,sessionLocals,requestTime} = require("./middleware/");
//const {requestTime} = require("./middleware/request-time")          //put this one in ^
//const {sessionLocals} = require("./middleware/session.locals");
//const {isAuthenticated} = require("./middleware/is-Authenticated");
const path = require("path");
const testRoutes = require("./routes/test/index.js");

const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser")
const session = require("express-session");

app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json()); // support json  bodies
app.use(express.urlencoded({extended: false}));
app.use(cookieParser()); 
app.set("views", path.join(__dirname,  "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "static")));
app.use(requestTime);
app.use(express.static(path.join(__dirname, "backend", "static")));
app.use("/test", testRoutes);


if (process.env.NODE_ENV == "development") {
  const livereload = require("livereload");
  const connectLiveReload = require("connect-livereload");
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, "backend", "static"));
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  app.use(connectLiveReload());
}

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(sessionLocals);

const Routes = require("./routes")

/*const gameRoutes = require("./routes/game");
const authRoutes = require("./routes/authentication");
const homeRoutes = require("./routes/home");
const userProfileRoutes = require("./routes/user_profile");
const lobbyRoutes = require("./routes/lobby");*/

app.use("/", Routes.home);
app.use("/auth", Routes.authentication);
app.use("/game", isAuthenticated, Routes.game);
app.use("/profile",isAuthenticated, Routes.user_profile);
app.use("/lobby", isAuthenticated, Routes.lobby);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use((request, response, next) => {
  next(createError(404));
});