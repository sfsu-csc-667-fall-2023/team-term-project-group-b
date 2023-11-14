require("dotenv").config();

const createError = require("http-errors");
const requestTime = require("./middleware/request-time")

const path = require("path");
const testRoutes = require("./routes/test/index.js");

const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extende: false}));
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

const gameRoutes = require("./routes/game");
const authRoutes = require("./routes/authentication");
const homeRoutes = require("./routes/home");
const userProfileRoutes = require("./routes/user_profile");
const lobbyRoutes = require("./routes/lobby");

app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/game", gameRoutes);
app.use("/profile", userProfileRoutes);
app.use("/lobby", lobbyRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use((request, response, next) => {
  next(createError(404));
});