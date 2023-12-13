require("dotenv").config();

const createError = require("http-errors");
const path = require("path");
const testRoutes = require("./routes/test/index.js");
const {createServer} = require("http");

const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser")
const session = require("express-session");
const { Server } = require("socket.io");

const {isAuthenticated,sessionLocals,requestTime} = require("./middleware/");

const httpServer = createServer(app);

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

const sessionMiddleware = session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
})

app.use(sessionMiddleware);

app.use(sessionLocals);
const io = new Server(httpServer)
io.engine.use(sessionMiddleware);
app.set("io", io)

io.on("connection", socket => {
  socket.join(socket.request.session.id);
  if (socket.handshake.query.id !== undefined) {
    socket.join(socket.handshake.query.id);
  }
})

const Routes = require("./routes");
const { engine } = require("express/lib/application");

app.use("/", Routes.home);
app.use("/auth", Routes.authentication);
app.use("/game", isAuthenticated, Routes.game);   //game is games in teachers proj
app.use("/profile",isAuthenticated, Routes.user_profile);
app.use("/lobby", isAuthenticated, Routes.lobby);
app.use("/chat", isAuthenticated, Routes.chat);


const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use((request, response, next) => {
  next(createError(404));
});