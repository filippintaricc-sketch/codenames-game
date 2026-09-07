var express = require("express");
var router = express.Router();

const data = require("../data/data.js");
let playerData = require("../data/players.js");
let game = require("../data/game.js");
let firstTurn = true;
let num = 0;

function gameStart() {
  /*praznjenje polja igraca ako postoje*/
  for (let i = 0; i < 4; i++) {
    playerData.teams.find((p) => p.id === i).players = [];
  }

  /*resetiranje svih opcija iz game.js*/
  game.words = [];
  game.guesses = [];
  game.blueScore = 9;
  game.redScore = 8;
  game.turn = "Plavi";
  game.clueGiven = false;
  game.gameStarted = false;
  game.winner = undefined;
  game.turnEndsAt =  null;
  game.timer = undefined;

  num = 0;
  firstTurn = true;

  /*pronalazak maksimalnog ida iz data.js za koristenje u rand funkciji*/
  let maxId = Math.max(...data.categories.map(c => c.id));

  /*punjenje polja rijeci sa 25 random rijeci iz data.js*/
  for (let i = 0; i < 25; ) {
    let index = Math.floor(Math.random() * (maxId+1));
    let array = data.categories.find((p) => p.id === index).words;
    let rand = Math.floor(Math.random() * array.length);
    let find = game.words.find((p) => p.word === array[rand]);
    if (!find) {/*stavi rijec samo ako nije duplic*/
      game.words.push({
        id: i,
        class: "nothing",
        guessed: false,
        word: array[rand],
      });
      i++;
    }
  }

  /*dodavanje klase blue 9 razlicitih rijeci*/
  for (let i = 0; i < 9; ) {
    let index = Math.floor(Math.random() * 25);
    if (game.words.find((p) => p.id === index).class === "nothing") {
      game.words.find((p) => p.id === index).class = "blue";
      i++;
    }
  }

  /*dodavanje klase red 8 razlicitih rijeci*/
  for (let i = 0; i < 8; ) {
    let index = Math.floor(Math.random() * 25);
    if (game.words.find((p) => p.id === index).class === "nothing") {
      game.words.find((p) => p.id === index).class = "red";
      i++;
    }
  }

  /*pronadi jednu i daj joj klasu black*/
  for (;;) {
    let index = Math.floor(Math.random() * 25);
    if (game.words.find((p) => p.id === index).class === "nothing") {
      game.words.find((p) => p.id === index).class = "black";
      break;
    }
  }
}
gameStart();


router.get("/", (req, res) => {
  /*zastita protiv manualnog ulazenja u /game*/
  if (!req.session.player) {
    res.redirect("/login");
    return;
  }

  if (!game.gameStarted) {
    res.redirect("/home");
    return;
  }
  if(firstTurn){
    game.turnEndsAt = Date.now() + (game.timer*4/3) * 1000;//vise vremena za osobu koja prva zadaje clue
    firstTurn = false;
  }

  /*pronadi hosta i team kojem pripada trenutni igrac te sve timove*/
  let host = req.session.player ===playerData.host;
  let name = req.session.player;
  let player = playerData.teams.find((p) => p.players.find((a) => a === name));
  let teams = playerData.teams;
  let pobjednik = game.winner;
  res.render("game", { game, player, teams, host, pobjednik});
});

router.post("/guess", (req, res) => {
  let { index } = req.body;
  let id = parseInt(index);

  /*promjeni stanje rijeci u pogodeno*/
  game.words.find((p) => p.id === id).guessed = true;

  /*promjeni potrebne brojace*/
  if (game.words.find((p) => p.id === id).class === "blue") game.blueScore--;
  else if (game.words.find((p) => p.id === id).class === "red") game.redScore--;
  else if (game.words.find((p) => p.id === id).class === "black") {
    game.winner = game.turn === "blue" ? "Plavi" : "Crveni";
    res.redirect("/game/gameOver");
    return;
  }

  /*ako je neki brojac 0 odi na gameOver*/
  if (!game.blueScore || !game.redScore) {
    res.redirect("/game/gameOver");
    return;
  }

  /*smanji brojac koliko ima jos rijeci za gadati u ovom redu*/
  game.guessesLeft--;

  /*dodaj u array pogodenih rijeci*/
  word = game.words.find((p) => p.id === id);
  game.guesses.find((p) => p.id === num).wordsGuessed.push({word: word.word, class: word.class});

  /*ako vise nema mogucnost gadanja promjeni red na drugi tim*/
  if (game.guessesLeft === 0) {
    res.redirect("/game/endTurn");
    return;
  }

  req.app.get("io").emit("game-update");
  res.redirect("/game");
});

router.post("/clue", (req, res) => {
  let { clue, numOfGuesses } = req.body;

  game.clueGiven = true;
  game.guessesLeft = parseInt(numOfGuesses) + 1;
  game.turnEndsAt = Date.now() + (game.timer*2/3) * 1000;//manje vremena za one koji gadaju

  game.guesses.push({ id: num, turn: game.turn, clue: clue, guessesNum: numOfGuesses, wordsGuessed: [] });

  req.app.get("io").emit("game-update");
  res.redirect("/game");
});

router.get("/endTurn", (req, res) => {
  game.turn = game.turn === "Plavi" ? "Crveni" : "Plavi";
  game.clueGiven = false;
  num++;
  game.turnEndsAt = Date.now() + game.timer * 1000;//vise vremena za onog koji zadaje clue

  req.app.get("io").emit("game-update");
  res.redirect("/game");
});

router.get("/gameOver", (req, res) => {
  for(let i = 0; i<25; i++){
    game.words.find((p) => p.id === i).guessed = true;
  }

  if(!game.winner)
    game.winner = game.blueScore === 0 ? "Plavi" : "Crveni";

  req.app.get("io").emit("game-update");
  res.redirect("/game");
});

router.post("/restart", (req, res)=>{
  gameStart();

  req.app.get("io").emit("game-update");
  res.redirect("/home");
})

module.exports = router;
