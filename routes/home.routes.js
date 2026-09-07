var express = require("express");
var router = express.Router();
let playerData = require("../data/players.js");
let game = require("../data/game.js");

router.get("/", (req, res) => {
  if(game.gameStarted){
    res.redirect("/game");
    return;
  }
  if (!req.session.player) {
    res.redirect("/login");
    return;
  }

  let host = playerData.host===req.session.player;
  let teams = playerData.teams;

  res.render("home", { teams, host});
});

router.post("/teamEnter", (req, res) => {
  if (!req.session.player) {
    res.redirect("/login");
    return;
  }
  let { team } = req.body;

  let index = parseInt(team);

  let find = playerData.teams.find(p=>p.players.find(p=>p===req.session.player));
  if(find){
    let index = find.players.indexOf(req.session.player);
    find.players.splice(index, 1);
  }

  playerData.teams.find(p=>p.id === index).players.push(req.session.player);

  req.session.entered = true;

  req.app.get("io").emit("game-update");
  res.redirect("/home");
});

router.get("/startGame", (req, res) => {
  /*if(!playerData.teams.find(p=>p.id===0).players.length || !playerData.teams.find(p=>p.id===1).players.length || !playerData.teams.find(p=>p.id===2).players.length || !playerData.teams.find(p=>p.id===3).players.length){
    res.redirect("/home");
    return;
  }
  */

  if(game.timer === undefined){
    res.redirect("/home");
    return;
  }
  if(!game.gameStarted) game.gameStarted = true;

  console.log(game.timer);

  req.app.get("io").emit("game-update");
  res.redirect("/game");
});

router.post("/setTimer", (req, res)=>{
  let {timer} = req.body;
  game.timer = parseInt(timer);

  res.redirect("/home");
})

module.exports = router;
