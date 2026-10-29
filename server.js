const express = require('express');
const app = express();
const path = require('path');
const session = require("express-session");
const home = require("./routes/home.routes");
const login = require("./routes/login.routes");
const game = require("./routes/game.routes");

app.use(express.urlencoded({
    extended: false
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'anything', // na Renderu se postavlja SESSION_SECRET
    resave: false,
    saveUninitialized: true,
  })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/home", home);
app.use("/login", login);
app.use("/game", game);

app.get("/", (req, res)=>{
    res.redirect("/login");
});

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

app.set("io", io); // da routes mogu pristupiti io

const PORT = process.env.PORT || 8080; // Render sam zadaje port kroz PORT
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
})