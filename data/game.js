module.exports = {
    gameStarted: false,
    winner: undefined,
    turn: "Plavi",
    turnEndsAt: null,
    timer: undefined,
    guessesLeft: 0,
    clueGiven: false,
    blueScore: 9,
    redScore: 8,
    words: [], /*oblika id: i,
                        class: "nothing",
                        guessed: false,
                        word: rijec, */
    guesses: [
             /* { id: num, turn: game.turn, clue: clue, wordsGuessed: [] } */
    ]
}