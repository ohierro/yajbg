const Game = require('./core/Game.js')
const WebDrawer = require('./drawers/WebDrawer.js')
const SamplePlayer = require('./players/sample-player.js')

// console.log('Started...')

// let game = new Game(new WebDrawer())

// // add players
// game.addPlayer(new SamplePlayer())
// game.addPlayer(new SamplePlayer())

// // init
// game.init()

// // start
// game.start()

module.exports = { Game, WebDrawer, SamplePlayer }

// module.exports = {
//   Game: require('./core/Game.js')
// }

// exports.Game = require('./core/Game.js')

