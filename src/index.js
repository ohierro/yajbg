// import Game from './core/Game'
const Game = require('./core/Game.js')
const ConsoleDrawer = require('./core/ConsoleDrawer.js')
const SamplePlayer = require('./players/sample-player.js')

console.log('Started...')

let game = new Game(new ConsoleDrawer())

// add players
game.addPlayer(new SamplePlayer())
game.addPlayer(new SamplePlayer())

// init
game.init()

// start
game.start()
